import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { handler as aiHandler } from './netlify/functions/lighthouse-ai.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 10000);
const publicFiles = new Set(['/index.html','/style.css','/app.js','/manifest.json','/sw.js','/slides.html']);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const securityHeaders = {
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'SAMEORIGIN',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':"default-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; manifest-src 'self'; base-uri 'self'; form-action 'self'"
};

function send(res,status,body,headers={}){res.writeHead(status,{...securityHeaders,...headers});res.end(body)}
function readBody(req){return new Promise((resolve,reject)=>{let data='';req.on('data',chunk=>{data+=chunk;if(data.length>50_000){reject(new Error('Request too large'));req.destroy()}});req.on('end',()=>resolve(data));req.on('error',reject)})}

const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/health')return send(res,200,JSON.stringify({ok:true}),{'Content-Type':'application/json'});
    if(url.pathname==='/api/ai'){
      if(req.method!=='POST')return send(res,405,JSON.stringify({error:'POST only'}),{'Content-Type':'application/json'});
      const body=await readBody(req);
      const result=await aiHandler({httpMethod:'POST',body});
      return send(res,result.statusCode,result.body,result.headers);
    }
    const requested=url.pathname==='/'?'/index.html':url.pathname;
    if(!publicFiles.has(requested))return send(res,404,'Not found',{'Content-Type':'text/plain; charset=utf-8'});
    const file=await readFile(path.join(root,requested));
    const cache=requested==='/sw.js'||requested==='/index.html'?'no-cache':'public, max-age=300';
    return send(res,200,file,{'Content-Type':mime[path.extname(requested)]||'application/octet-stream','Cache-Control':cache});
  }catch(error){console.error(error);return send(res,500,JSON.stringify({error:'Server error'}),{'Content-Type':'application/json'})}
});
server.listen(port,'0.0.0.0',()=>console.log(`Lighthouse running on 0.0.0.0:${port}`));
