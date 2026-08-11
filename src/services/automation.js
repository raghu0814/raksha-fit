import pool from "../config/db.js";

export const render = (template, values) => template.replace(/{{(member_name|gym_name|expiry_date|amount|plan_name)}}/g, (_, key) => values[key] ?? "");
async function queue(gym, member, templateName, eventKey) {
  const template = await pool.query("SELECT template FROM notification_templates WHERE gym_id=$1 AND channel='whatsapp' AND name=$2", [gym.id, templateName]);
  if (!template.rowCount) return false;
  const message = render(template.rows[0].template, { member_name: member.name, gym_name: gym.name, expiry_date: member.valid_till || "", amount: "", plan_name: member.plan_name || "" });
  const result = await pool.query("INSERT INTO notification_logs(gym_id,member_id,channel,template_name,message,status,event_key) VALUES($1,$2,'whatsapp',$3,$4,'pending_manual',$5) ON CONFLICT (event_key) WHERE event_key IS NOT NULL DO NOTHING RETURNING id", [gym.id, member.id, templateName, message, eventKey]);
  return Boolean(result.rowCount);
}

export async function runAutomation() {
  const gyms = (await pool.query("SELECT id,name,inactivity_threshold_days,expiry_reminder_days FROM gyms")).rows;
  let queued = 0;
  for (const gym of gyms) {
    const expiring = (await pool.query("SELECT m.*,p.name plan_name FROM members m LEFT JOIN membership_plans p ON p.id=m.plan_id WHERE m.gym_id=$1 AND m.status='active' AND m.valid_till=CURRENT_DATE+$2", [gym.id, gym.expiry_reminder_days])).rows;
    for (const member of expiring) queued += await queue(gym, member, "membership_expiring", `expiry:${gym.id}:${member.id}:${member.valid_till}`);
    const expired = (await pool.query("SELECT m.*,p.name plan_name FROM members m LEFT JOIN membership_plans p ON p.id=m.plan_id WHERE m.gym_id=$1 AND m.status='active' AND m.valid_till=CURRENT_DATE-1", [gym.id])).rows;
    for (const member of expired) queued += await queue(gym, member, "membership_expired", `expired:${gym.id}:${member.id}:${member.valid_till}`);
    const inactive = (await pool.query("SELECT m.*,p.name plan_name FROM members m LEFT JOIN membership_plans p ON p.id=m.plan_id WHERE m.gym_id=$1 AND m.status='active' AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.member_id=m.id AND a.date>=CURRENT_DATE-$2)", [gym.id, gym.inactivity_threshold_days])).rows;
    for (const member of inactive) queued += await queue(gym, member, "absent_member", `absent:${gym.id}:${member.id}:${new Date().toISOString().slice(0,10)}`);
  }
  return { queued, mode: "manual_pending", message: "No provider was called; queued notifications require manual WhatsApp action." };
}
