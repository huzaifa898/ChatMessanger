'use client';
import Button from '@/components/Button';
import Input from '@/components/inputs/Input';
import AuthSocialButton from '../components/AuthSocialButton';
import { useCallback, useEffect, useState } from "react";
import { useForm ,FieldValues ,SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import {signIn ,useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
type Variant = 'login' | 'register';
const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant ,setVariant] = useState <Variant>('login');
    const [isloading, setIsLoading] = useState(false);
     
    useEffect(() => {
     if(session ?.status === 'authenticated'){
        router.push('/users');
     }
    }, [session?.status ,router]);


    const toggleVarient =  useCallback(() => {
        if(variant === 'login'){
            setVariant('register');
        }else{
            setVariant('login');
        }
    }, [variant]);
        
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues:{
            name:'',
            email:'',
            password:'',
        }
    });

    const onSubmit : SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            if (variant === 'register') {
                // axios call to register
                const response = await axios.post('/api/register', data)
                .then(() => signIn ('credentials',data))
                .catch(() => toast.error('Something Went Wrong'))
                .finally(() => setIsLoading(false))
                //console.log('Registration successful:', response.data);
            }

            if (variant === 'login') {
                // axios call to login
                signIn('credentials' ,{
                    ...data,
                    redirect: false
                })
                .then((callback) =>{
                   if(callback?.error){
                    toast.error('Invaild Credentials')
                   }
                   if (callback?.ok && !callback?.error){
                    toast.success('successfully login')
                    router.push('/users');
                   }
                })
                .finally(() => setIsLoading(false));
            }
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        // axios call to social login
        setIsLoading(false);
    }

    return (
        <div className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
        ">
            <div className="
            bg-white
            py-8
            px-4
            shadow
            sm:rounded-lg
            sm:px-10
            ">
                <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'register' && (
                        <Input id="name"
                        label='Name' 
                        register={register}
                        error={errors} 
                        />
                    )}
                    <Input id="email"
                    label='Email address' 
                    type='email'
                    register={register}
                    error={errors} 
                    />
                    <Input id="password"
                    label='Password' 
                    type='password'
                    register={register}
                    error={errors} 
                    />
                    <div>
                        <Button
                        disabled={isloading}
                        fullWidth
                        type='submit'
                        >
                        {variant === 'login' ? 'Sign In' : 'Register'}
                        </Button>
                    </div>
                </form>
                
                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton
                        Icon={BsGithub}
                        onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                        Icon={BsGoogle}
                        onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                 
                <div className="
                flex
                gap-2
                justify-center
                text-sm
                mt-6
                px-2
                text-gray-500
                ">
                    <div>
                        {variant === 'login' ? 'New to Chat Messenger?' : 'Already have an account?'}
                    </div>
                    <div 
                    onClick={toggleVarient}
                    className='underline cursor-pointer'
                    >
                        {variant === 'login' ? 'Create an Account' : 'Log In'}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AuthForm;