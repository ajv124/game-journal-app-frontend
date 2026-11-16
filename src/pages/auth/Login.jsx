import * as yup from 'yup'
import { Eye, EyeOff, UserRound } from 'lucide-react'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
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
import { loginAPI } from '@/services/allAPI'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"

function Login() {

    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const validationSchema = yup.object({
        usernameOrEmail: yup.string().trim().required('Username or email is required'),

        password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters')
    })

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: ''
        },
    })

    const onSubmit = async (data) => {
        try {
            const response = await loginAPI(data)
            const user = response.user
            login(user)
            toast.add({
                title: 'Success',
                description: "Login successful",
                type: 'success'
            })
            navigate('/')
        } catch (error) {
            console.error(error)
            toast.add({
                title: 'Login failed',
                description: 'Login failed',
                type: 'error'
            })
        }
    }

    return (
        <div className='flex min-h-[80dvh] justify-center items-center'>
            <Card className='flex flex-col border-2 border-accent rounded-md w-80 sm:w-100'>

                <CardHeader className='flex flex-col justify-center items-center'>
                    <UserRound
                        aria-hidden='true'
                        className='size-15 border-2 rounded-full p-1'
                    />
                    <CardTitle className='text-2xl'>Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FieldSet>
                            <FieldLegend className='sr-only'>Login</FieldLegend>

                            <FieldGroup>

                                <Field data-invalid={!!errors.usernameOrEmail}>
                                    <FieldLabel htmlFor="usernameOrEmail">
                                        Username or Email
                                    </FieldLabel>

                                    <Input
                                        id="usernameOrEmail"
                                        type="text"
                                        placeholder="Enter Username or Email"
                                        autoComplete="username"
                                        aria-invalid={!!errors.usernameOrEmail}
                                        {...register('usernameOrEmail')}
                                    />

                                    {errors.usernameOrEmail && (
                                        <FieldError>
                                            {errors.usernameOrEmail.message}
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
                                            autoComplete="current-password"
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
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>

                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>

                <CardFooter className='flex justify-center'>
                    <Link
                        className='underline underline-offset-2 hover:text-muted-foreground'
                        to="/register"
                    >
                        New User? Register here
                    </Link>
                </CardFooter>

            </Card>
        </div>
    )
}

export default Login
