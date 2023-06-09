import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
            const item = await Item.findOrFail(params.id)

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

    // public async store({ request, response }: HttpContextContract) {
    //     try {
            
    //     } catch (error) {
    //         return response.status(500).json({
    //             code: 500,
    //             message: "ERROR",
    //             error: error.message 
    //         })
    //     }
    // } 
}
