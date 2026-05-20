import React, { useState } from 'react'
import logo from '../assets/ui/logo.png'
import { Code, LockKeyholeOpen, PencilLine, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from "../components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { createUser, loginUser } from '@/services/AuthServices'
import toast from 'react-hot-toast'

// SignUp page is devided in two parts input fields are in second part {right side page}
//  i have commented it below as {left side page and right side page }
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const SignUp = () => {
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    })
    const navigate = useNavigate();                

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }
        ))
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }))
    }

    //Validation 
    const validateForm = () => {
        const newErrors = {};

        //fullName Validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "full name is required"
        }
        else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = "name must contain at least 3 letters"
        }

        if (!formData.userName.trim()) {
            newErrors.userName = "username is required"
        }
        else if (formData.userName.trim().length < 3) {
            newErrors.userName = "username must contain at least 3 letters"
        }
        else if (formData.userName.includes(" ")) {
            newErrors.userName = "spaces are not allowed"
        }
        if (!formData.email.trim()) {
            newErrors.email = "email is required"
        }
        else if (!isValidEmail(formData.email)) {
            newErrors.email = "Enter a valid email id"
        }
        if (!formData.password) {
            newErrors.password = "password is required"
        }
        else if (formData.password.length < 8) {
            newErrors.password = "password must be at least 8 characters"
        }
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "passwords do not match "
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "you must accept terms and coditions to register!!"
        }

        //changing state
        setErrors(newErrors)


        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (!isValid) {
            return;
        }
        try {
            setLoading(true);

            const userData = {
                userName: formData.userName,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            }
            const data=await createUser(userData)
            console.log(data);
            

            if (data?.statusCode===201) {
                
                toast.success("User registered succesfully ")
                navigate("/login");
            }

            

        } catch (error) {
            console.log(error)

            const message =
                error.response?.data?.message ||
                "Something went wrong"

            toast.error(message)
        } finally {
            setLoading(false);
        }
    }





    return (
        <div className='flex justify-center items-center  bg-background overflow-hidden  '>
            <div>
                <div className='flex items-center justify-between mx-5 md:mx-10'>
                    <div>
                        <img src={logo} alt="" className="h-16 w-16" />
                    </div>
                    <div className='flex items-center md:gap-2 text-xs'>
                        <p className='hidden md:block'>Already have an account? </p>
                        <Link to="/login">  Login</Link>

                    </div>

                </div>
                <div className='max-w-4xl w-full grid md:grid-cols-2 border border-purple-200 rounded-md overflow-hidden m-5 h-[calc(100vh-124px)] '>
                    {/* left side page */}
                    <div className='hidden md:block bg-gray-100 p-4 '>
                        <h1 className='font-bold'>Join DevConnect</h1>
                        <p className='text-xs'>Connect with developers, share ideas, and build your network</p>
                        <div>
                            <img src={logo} alt="" className="h-50 w-50" />
                        </div>

                        <div className='flex items-center-safe justify-start gap-2 mb-2'>
                            <div className='border bg-gray-300 p-3 rounded-sm'><UsersRound /></div>
                            <div>
                                <div>Connect</div>
                                <div className='text-xs' >Follow developers and build your professional network</div>
                            </div>
                        </div>
                        <div className='flex items-center-safe justify-start mb-2 gap-2'>
                            <div className='border bg-gray-300 p-3 rounded-sm'><PencilLine /></div>
                            <div>
                                <div>Share</div>
                                <div className='text-xs'>Share your thoughts, projects and ideas with the community </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-start gap-2'>
                            <div className='border bg-gray-300 p-3 rounded-sm'><Code /></div>
                            <div>
                                <div>Build</div>
                                <div className='text-xs'>Showcase your work and grow your developer brand</div>
                            </div>
                        </div>
                    </div>
                    {/* right side page */}
                    <div className='p-4 overflow-y-auto max-h-screen'>
                        <div className='flex justify-center items-center md:hidden '>
                            <img src={logo} alt="" className="h-12 w-12" />

                        </div>
                        <h1 className='font-bold'>Create your account</h1>
                        <p className='text-xs'>Sign up to get starte with DevConnect</p>

                        <form onSubmit={handleSubmit}>
                            <FieldGroup className={`mt-3 gap-2`}>
                                <Field >
                                    <FieldLabel htmlFor="input-field-fullname" className="text-sm">Full Name</FieldLabel>
                                    <Input required
                                        name="fullName"
                                        value={formData.fullName}
                                        id="input-field-fullname"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={`text-xs ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
                                            }`}
                                        onChange={handleChange}

                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}

                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="input-field-username" className="text-sm">Username</FieldLabel>
                                    <Input required
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        id="input-field-username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className={`text-xs ${errors.userName ? "border-red-500 focus-visible:ring-red-500" : ""
                                            }`}
                                    />
                                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}

                                </Field>
                                <Field >
                                    <FieldLabel htmlFor="input-field-email" className="text-sm">email</FieldLabel>
                                    <Input required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        id="input-field-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`text-xs ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                                            }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                                </Field>
                                <Field >
                                    <FieldLabel htmlFor="input-field-password" className="text-sm">password</FieldLabel>
                                    <Input required
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        id="input-field-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className={`text-xs ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                                            }`}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                                </Field>
                                <Field >
                                    <FieldLabel htmlFor="input-field-confirm-password" className="text-sm">Confirm password</FieldLabel>
                                    <Input required
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        id="input-field-confirm-password"
                                        type="password"
                                        placeholder="Confirm your password"
                                        className={`text-xs ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                                            }`}

                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}

                                </Field>
                                {/* <Field >
                                    <FieldLabel htmlFor="input-field-location" className="text-sm">Location <span>(optional)</span></FieldLabel>
                                    <Input
                                        id="input-field-location"
                                        type="text"
                                        placeholder="Enter Your Location"
                                        className={`text-xs`}
                                    />
                                </Field> */}
                                {/* <Field >
                                    <FieldLabel htmlFor="input-field-bio" className="text-sm"> Bio <span>(optional)</span></FieldLabel>
                                    <Textarea
                                        id="input-field-bio"
                                        type="textarea"
                                        placeholder="Tell me about yourself"
                                        className={`text-xs`}
                                    />
                                </Field> */}

                                {/* <Field>
                                    <FieldLabel htmlFor="picture" className="text-sm">Picture</FieldLabel>
                                    <Input id="picture" type="file" className={`cursor-pointer`} />
                                    <FieldDescription className={`text-xs`}>Select a picture to upload.</FieldDescription>
                                </Field> */}
                                {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
                                <Field orientation="horizontal">
                                    <Checkbox id="terms-checkbox" name="acceptTerms" checked={formData.acceptTerms}
                                        onCheckedChange={(checked) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                acceptTerms: checked
                                            }))

                                            setErrors((prev) => ({
                                                ...prev,
                                                acceptTerms: ""
                                            }))
                                        }} />
                                    <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>

                                </Field>
                                <Field>
                                    <button type='submit' disabled={loading}
                                        className="button-devconnect disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? "Creating Account..." : "Create Your Account"}
                                    </button>
                                </Field>


                            </FieldGroup>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
