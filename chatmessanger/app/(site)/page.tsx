import Image from 'next/image';
import AuthForm from './components/auth';
export default function Home() {
  return (
      <div className="
       flex
       min-h-full
       flex-col
       justify-center
       py-12
       sm:px-6
       bg-gray-100
      ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <Image
           alt='ChatMessanger Logo'
           height="48"
           width="48"
           className='mx-auto w-auto'
           src="/images/logo.png"
           />
           <h2 className='
           mt-6
           text-center
           text-3xl
           font-bold
           tracking-tight
           text-gray-900
           '>
             Log In Into Octaloop ChatMessanger
           </h2>
          </div>
          <AuthForm />
          {/* Add our Auth code here */}
      </div>
);
}
