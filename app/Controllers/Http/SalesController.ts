import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import Item from 'App/Models/Item'
import Sales from 'App/Models/Sales'
import SalesDet from 'App/Models/SalesDet'

export default class SalesController {
  public async getSales({ response }: HttpContextContract) {
    try {
      const sales = await Sales.all()

      await Promise.all(sales.map(async (sale) => {
        await sale.load('salesDets')
      }))

      return response.status(200).json({
        code: 200,
        message: 'OK',
        sales: sales,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'ERROR',
        error: error.message,
      })
    }
  }

  public async getSale({ params, response }: HttpContextContract) {
    try {
      const sale = await Sales.find(params.id)

      if (!sale) {
        return response.status(404).json({
          code: 404,
          message: 'Not Found',
          error: 'Sale not found',
        })
      }

      await sale.load('salesDets')

      return response.status(200).json({
        code: 200,
        message: 'OK',
        sale: sale,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'ERROR',
        error: error.message,
      })
    }
  }

  public async createSale({ request, response }: HttpContextContract) {
    try {
      const { customerId, items, discount, shippingCost, date } = request.only([
        'customerId',
        'items',
        'discount',
        'shippingCost',
        'date',
      ])
  
      // Cek apakah customer valid
      const customer = await Customer.find(customerId)
      if (!customer) {
        return response.status(404).json({
          code: 404,
          message: 'Not Found',
          error: 'Customer not found',
        })
      }
  
      // Buat data penjualan baru
      const sale = new Sales()
      sale.code = Sales.generateUniqueCode()
      sale.customerId = customer.id
      sale.date = date ? new Date(date).toISOString() : new Date().toISOString()
      sale.subtotal = 0
      sale.discount = discount || 0
      sale.shippingCost = shippingCost || 0
      sale.totalCost = 0
      await sale.save()
  
      // Iterasi dan tambahkan detail penjualan
      for (const itemData of items) {
        const { itemId, quantity } = itemData
  
        // Cek apakah item valid
        const item = await Item.find(itemId)
        if (!item) {
          return response.status(404).json({
            code: 404,
            message: 'Not Found',
            error: `Item with ID ${itemId} not found`,
          })
        }
  
        // Buat data detail penjualan
        const salesDet = new SalesDet()
        salesDet.itemId = item.id
        salesDet.listPrice = item.price
        salesDet.quantity = quantity
        salesDet.discountPercentage = 0
        salesDet.discountAmount = 0
        salesDet.discountedPrice = item.price
        salesDet.total = item.price * quantity
        await salesDet.save()
  
        await sale.related('salesDets').save(salesDet)
  
        // Update subtotal dan total penjualan
        sale.subtotal += salesDet.total
        sale.totalCost += salesDet.total
        await sale.save()
      }
  
      return response.status(200).json({
        code: 200,
        message: 'OK',
        sale: sale,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'ERROR',
        error: error.message,
      })
    }
  }

  public async deleteSale({ params, response }: HttpContextContract) {
    try {
      const sale = await Sales.findOrFail(params.id)

      await sale.related('salesDets').query().delete()
      await sale.delete()

      return response.status(200).json({
        code: 200,
        message: 'OK',
        success: true,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'ERROR',
        error: error.message,
      })
    }
  }
}