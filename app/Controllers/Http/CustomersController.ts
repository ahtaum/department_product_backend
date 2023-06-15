import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer'

export default class CustomersController {
    public async getCustomers({ response }: HttpContextContract) {
        try {
            const customers = await Customer.query().preload('sales')

            return response.status(200).json({
                code: 200,
                message: "OK",
                total: customers.length,
                customers: customers
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async getCustomer({ response, params }: HttpContextContract) {
        try {
            const customer =  await Customer.query().preload('sales').where('id', params.id).first()

            if (!customer) {
              return response.status(404).json({
                code: 404,
                message: 'Not Found',
                error: 'customer not found',
              })
            }

            return response.status(200).json({
                code: 200,
                message: "OK",
                customer: customer
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async store({ request, response }: HttpContextContract) {
        await request.validate({
            schema: schema.create({
                name: schema.string({ trim: true }),
                phone: schema.string({ trim: true }),
            }),
            messages: {
                'name.required': "name is required!",
                "phone.required": "price is required!"
            }
        })          
        
        try {
            const data = new Customer()
            data.name = request.input("name")
            data.phone = request.input("phone")

            await data.save()

            return response.status(201).json({
                code: 201,
                message: 'Customer successfuly added!',
                result: data,
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async update({ request, response, params }: HttpContextContract) {
        const validateInput = await request.validate({
            schema: schema.create({
                name: schema.string({ trim: true }),
                phone: schema.string({ trim: true }),
            })
        }) 

        try {
            const customer = await Customer.findOrFail(params.id)

            customer.name = validateInput.name
            customer.phone = validateInput.phone

            await customer.save()

            return response.status(200).json({
                code: 200,
                message: 'customer updated successfully!',
                result: customer,
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async destroy({ response, params }: HttpContextContract) {
        try {
          const customer = await Customer.findOrFail(params.id)
      
          await customer.delete()
      
          return response.status(200).json({
            code: 200,
            message: 'customer deleted successfully!'
          })
        } catch (error) {
          return response.status(500).json({
            code: 500,
            message: 'Error',
            error: error.message,
          })
        }
    } 
}
