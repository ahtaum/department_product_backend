import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
    public async getUsers({ response }: HttpContextContract) {
        try {
            const users = await User.all()

            return response.status(200).json({
                code: 200,
                message: "OK",
                total: users.length,
                users: users
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async getUser({ response, params }: HttpContextContract) {
        try {
            const user = await User.find(params.id)

            if (!user) {
                return response.status(404).json({
                  code: 404,
                  message: 'Not Found',
                  error: 'User not found',
                })
            }

            return response.status(200).json({
                code: 200,
                message: "OK",
                user: user
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async login({ request, response, auth }: HttpContextContract) {
        await request.validate({
            schema: schema.create({
              email: schema.string({ trim: true }, [rules.email()]),
              password: schema.string({ trim: true }),
            })
        })

        try {
            const token = await auth.use("api").attempt(request.input("email"), request.input("password"), {
                expiresIn: "1 days"
            })

            const userdata: User | null = await User.findBy("email", request.input("email"))

            return response.status(200).send({ 
                code: 200, 
                message: "OK",
                token: token.toJSON(), 
                user_data: userdata 
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
          await auth.use('api').revoke()

            return response.status(200).send({ 
                code: 200, 
                message: "You Are Logout!"
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async register({ request, response }: HttpContextContract) {
        await request.validate({
            schema: schema.create({
              email: schema.string({ trim: true }, [
                rules.email(),
                rules.required(),
              ]),
              name: schema.string({ trim: true }, [
                rules.maxLength(10),
                rules.required(),
              ]),
              password: schema.string({ trim: true }, [
                rules.required(),
              ]),
              password_confirm: schema.string({ trim: true }, [
                rules.confirmed('password'),
                rules.required(),
              ]),
            }),
            messages: {
              required: '{{ field }} is required.',
              'name.maxLength': 'Name should not exceed 10 characters.',
              'email.email': 'Invalid email format.',
              'password_confirm.confirmed': 'Password confirmation does not match.',
            },
        })

        try {
            let data = new User()
            data.email = request.input('email')
            data.name = request.input('name')
            data.password = request.input('password')
      
            await data.save()
      
            return response.status(200).send({ 
                code: 200, 
                status: "OK", 
                result: data 
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }
}
