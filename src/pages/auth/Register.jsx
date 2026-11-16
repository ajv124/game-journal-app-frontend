import * as yup from 'yup'
import { UserRound, Eye, EyeOff } from 'lucide-react'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerAPI } from '@/services/allAPI'
import { toast } from '@/components/ui/toast'
import { useState } from 'react'
import {
    InputGroup,
    InputGroupInput,
    InputGroupButton,
} from "@/components/ui/input-group"

function Register() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const validationSchema = yup.object({
        username: yup.string().trim().required('Username is required').min(3, 'Username must be at least 3 characters'),

        email: yup.string().trim().required('Email is required').email('Enter a valid email address'),

        password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters')
    })

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
    })

    const onSubmit = async (data) => {
        try {
            const response = await registerAPI(data)
            toast.add({
                title: 'Success',
                description: response.data,
                type: 'success'
            })
            navigate('/login')
        } catch (error) {
            console.error(error)
            toast.add({
                title: 'Registration failed',
                description: 'Registration failed',
                type: 'error'
            })
        }
    }

    return (
        <div className='flex min-h-[80dvh] justify-center items-center'>
            <Card className='flex flex-col border-2 border-accent rounded-md w-80 sm:w-100'>
                <CardHeader className='flex flex-col justify-center items-center'>
                    <UserRound aria-hidden='true' className='size-15 border-2 rounded-full p-1' />
                    <CardTitle className='text-2xl'>Register</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FieldSet>
                            <FieldLegend className='sr-only'>Register</FieldLegend>

                            <FieldGroup>
                                <Field data-invalid={!!errors.username}>
                                    <FieldLabel htmlFor="username">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter Username"
                                        autoComplete="username"
                                        aria-invalid={!!errors.username}
                                        {...register('username')}
                                    />
                                    {errors.username && (
                                        <FieldError>
                                            {errors.username.message}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        autoComplete="email"
                                        aria-invalid={!!errors.email}
                                        {...register('email')}
                                    />

                                    {errors.email && (
                                        <FieldError>
                                            {errors.email.message}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Password"
                                            autoComplete="new-password"
                                            aria-invalid={!!errors.password}
                                            {...register('password')}
                                        />
                                        <InputGroupButton
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? (
                                                <EyeOff />
                                            ) : (
                                                <Eye />
                                            )}
                                        </InputGroupButton>
                                    </InputGroup>
                                    {errors.password && (
                                        <FieldError>
                                            {errors.password.message}
                                        </FieldError>
                                    )}
                                </Field>

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Registering...' : 'Register'}
                                </Button>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>

                <CardFooter className='flex justify-center'>
                    <Link
                        className='underline underline-offset-2 hover:text-muted-foreground'
                        to="/login"
                    >
                        Already have an account? Login here
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register
