import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret=()=>process.env.JWT_SECRET||'demo-only-change-me-before-production';
export const hashPin=pin=>bcrypt.hash(String(pin),10);
export const checkPin=(pin,hash)=>bcrypt.compare(String(pin),hash);
export const issueToken=user=>jwt.sign({sub:user.id,role:user.role,name:user.name,schoolId:user.school_id,linkedStudentId:user.linked_student_id||null},secret(),{expiresIn:'8h',issuer:'lighthouse'});
export function requireAuth(roles=[]){return(req,res,next)=>{try{const value=req.headers.authorization||'';const token=value.startsWith('Bearer ')?value.slice(7):null;if(!token)throw new Error('Missing token');req.user=jwt.verify(token,secret(),{issuer:'lighthouse'});if(roles.length&&!roles.includes(req.user.role))return res.status(403).json({error:'This role cannot access that information.'});next()}catch{return res.status(401).json({error:'Sign in required.'})}}}
export function safeUser(user){return{id:user.id,name:user.name,role:user.role,schoolId:user.school_id,linkedStudentId:user.linked_student_id||null}}
