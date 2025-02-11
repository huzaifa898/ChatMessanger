'use client';
import Button from '@/components/Button';
import Input from '@/components/inputs/Input';
import AuthSocialButton from '../components/AuthSocialButton';
import { useCallback, useState } from "react";
import { useForm ,FieldValues ,SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
type Variant = 'login' | 'register';
const AuthForm = () => {
    const [variant ,setVariant] = useState <Variant>('login');
    const [isloading, setIsLoading] = useState(false);


    const toggleVarient =  useCallback(() => {
        if(variant === 'login'){
            setVariant('register');
        }else{
            setVariant('login');
        }
        } ,[variant]);
        
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>(
        {
            defaultValues:{
                name:'',
                email:'',
                password:'',
               
            }
        }
    );

    const onSubmit : SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        if (variant === 'register'){
            // axios call to register
        }

        if (variant === 'login'){
            // axios call to login
        }
        setIsLoading(false);

    }

    const socialAction =(action:string) => {
        setIsLoading(true);
        // axios call to social login
        setIsLoading(false);
    }
    return(
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
                    <Input id="email"
                    label='Email' 
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
                    label='password' 
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
                        {variant === 'login' ? 'Sign In': 'register'}
                        </Button>
                    </div>
             </form>
                
                <div className='mt-6'>
                    <div className='relative'>
                        <div 
                        className='absolute inset-0 flex items-center'>
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
                    {variant === 'login' ? 'New to Chat Messanger?': 'Already have an account?'}
                   </div>
                   <div 
                  onClick={toggleVarient}
                  className='underline cursor-pointer'
                  >
                    {variant === 'login' ? 'Create an Account': 'Log In'}
                  </div>
                 </div>
                  
                 


            </div>
     
        </div>
    );
}
export default AuthForm;