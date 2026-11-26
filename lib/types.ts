import {homepageDefaults} from './homepage.mjs';
export type Homepage = typeof homepageDefaults;
export type Service={id:string;name:string;tag:string;description:string;price:number|null;duration:string;features:string[];active:boolean};
export type Portfolio={id:string;title:string;category:string;before:string;after:string;description:string};
export type Content={homepage?:Homepage;settings:{brand:string;headline:string;description:string;area:string;instagram:string;phone:string;email:string;hours:string;notice:string;blockedDates:string[];times:string[];bookingEnabled:boolean};services:Service[];portfolio:Portfolio[];faqs:{q:string;a:string}[]};
export type Booking={id:string;name:string;email:string;phone:string;zip:string;vehicle:string;service:string;concerns:string;date:string;time:string;notes:string;status:string;created:string};
export async function request<T>(url:string,options?:RequestInit):Promise<T>{const r=await fetch(url,{...options,headers:{...(options?.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options?.headers}});const data=await r.json();if(!r.ok)throw new Error(data.error||'Something went wrong. Please try again.');return data;}
