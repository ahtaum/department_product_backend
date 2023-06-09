import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Item from 'App/Models/Item'

export default class ItemsController {
    public async getItems({ response }: HttpContextContract) {
        try {
            const items = await Item.all()

            return response.status(200).json({
                code: 200,
                message: "OK",
                total: items.length,
                items: items
            })
        } catch (error) {
            return response.status(500).json({
                code: 500,
                message: "ERROR",
                error: error.message 
            })
        }
    }

    public async getItem({ response, params }: HttpContextContract) {
        try {
            const item = await Item.find(params.id)

            if (!item) {
              return response.status(404).json({
                code: 404,
                message: 'Not Found',
                error: 'Item not found',
              })
            }

            return response.status(200).json({
                code: 200,
                message: "OK",
                item: item
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
                price: schema.number(),
            })
        })          
        
        try {
            const data = new Item()
            data.name = request.input("name")
            data.price = request.input("price")

            await data.save()

            return response.status(201).json({
                code: 201,
                message: 'Item successfuly added!',
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
                price: schema.number(),
            })
        }) 

        try {
            const item = await Item.findOrFail(params.id)

            item.name = validateInput.name
            item.price = validateInput.price

            await item.save()

            return response.status(200).json({
                code: 200,
                message: 'Item updated successfully!',
                result: item,
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
          const item = await Item.findOrFail(params.id)
      
          await item.delete()
      
          return response.status(200).json({
            code: 200,
            message: 'Item deleted successfully!'
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
