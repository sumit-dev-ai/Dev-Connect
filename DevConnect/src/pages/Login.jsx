import useAuthContext from '@/context/authContext'
import { loginUser } from '@/services/AuthServices'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}



export const Login = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const {setUser} = useAuthContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
         setErrors((prev) => ({
        ...prev,
        [name]: ""
    }));


    }
    const formValidation = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        }
        else if (!isValidEmail(formData.email)) {
            newErrors.email = "Invalid email id"
        }
        if (!formData.password) {
            newErrors.password = "password is required"
        }
        else if (formData.password.length < 8) {
            newErrors.password = "Invalid password : passwordmust contain 8 characters"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = formValidation()
        if (!isValid) return;

        try {
            setLoading(true)

            const userData = {
                email: formData.email,
                password: formData.password
            }
            const data = await loginUser(userData);

            //auth step 3
            // console.log(data.data.user)
            setUser(data.data.user);
            console.log(data);
            toast.success(data?.message)
            navigate("/")
            
            


        } catch (error) {
            console.log(error)

            const message =
                error.response?.data?.message ||
                "Something went wrong"

            alert(message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='md:relative min-h-screen md:bg-gray-100 backdrop-blur-md'>
            <div className='m-2 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'>


                <form onSubmit={handleSubmit} className="max-w-sm mx-auto border border-purple-300 rounded-md p-4 bg-background">
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
                        <input type="email" id='email' name="email" value={formData.email} onChange={handleChange} placeholder='enter your email' 
                        className={`bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body                  
                                    ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                            }
                            `}  />
                        {
                            errors.email && (
                                <p className={`text-red-500 text-sm mt-1 `}>
                                    {errors.email}
                                </p>
                            )
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">Your password</label>
                        <input type="password" id='password' name="password" value={formData.password} onChange={handleChange} className={`bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                            ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                            }
                            `} placeholder="••••••••" required />
                        {
                            errors.password && (
                                <p className={`text-red-500 text-sm mt-1  `}>
                                    {errors.password}
                                </p>
                            )
                        }
                    </div>

                    <div className='flex items-center justify-between' >
                        <button type="submit" disabled={loading}
                            className={`flex-1 text-white button-devconnect bg-brand box-border border 
                        border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs 
                        font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none
                         ${loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-brand-strong"
                                }
                        `}>{loading ? " Logging in.." : "Submit"}</button>
                    </div>
                    <div className='flex items-center justify-end'>
                        <Link to="/sign-up" className='text-blue-700 cursor-pointer test-xs underline'>register</Link>
                    </div>
                </form>

            </div>
        </div>
    )
}
