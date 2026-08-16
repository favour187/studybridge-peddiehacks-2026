export async function sendFamilyMessage({to,message}){
  if(!process.env.TERMII_API_KEY)return{sent:false,provider:'demo',reason:'TERMII_API_KEY not configured'};
  const response=await fetch(process.env.TERMII_API_URL||'https://v3.api.termii.com/api/sms/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:process.env.TERMII_API_KEY,to,from:process.env.TERMII_SENDER_ID||'Lighthouse',sms:message,type:'plain',channel:process.env.TERMII_CHANNEL||'generic'})});
  const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.message||`Termii returned ${response.status}`);return{sent:true,provider:'termii',result};
}
export async function sendWhatsApp({to,message}){
  if(!process.env.WHATSAPP_TOKEN||!process.env.WHATSAPP_PHONE_NUMBER_ID)return{sent:false,provider:'demo',reason:'WhatsApp variables not configured'};
  const response=await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION||'v21.0'}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{Authorization:`Bearer ${process.env.WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to,type:'text',text:{body:message}})});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result?.error?.message||`WhatsApp returned ${response.status}`);return{sent:true,provider:'whatsapp',result};
}
