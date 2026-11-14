import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'B’s Wax Auto Spa | A Fresh Start for Your Interior',description:'Mobile interior detailing in Southwest Houston and surrounding areas. Explore the detail lab and request your personalised interior detail.',icons:{icon:'/favicon.svg'},openGraph:{title:'B’s Wax Auto Spa — A little buzz. A whole new feeling.',description:'Mobile interior detailing, brought right to your driveway.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
