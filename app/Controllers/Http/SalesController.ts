import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import Item from 'App/Models/Item'
import Sales from 'App/Models/Sales'
import SalesDet from 'App/Models/SalesDet'
import { Decimal } from 'decimal.js'

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

  // masih test
  // public async getCustomersWithSalesAndSalesDet({ response }: HttpContextContract) {
  //   try {
  //     const customers = await Customer.query().has('sales').preload('sales', (query) => {
  //       query.preload('salesDets')
  //     })

  //     const customerData = customers.map((customer) => {
  //       let totalQuantity = 0

  //       customer.sales.forEach((sale) => {
  //         sale.salesDets.forEach((salesDet) => {
  //           totalQuantity += salesDet.quantity
  //         })
  //       })

  //       return {
  //         customer: customer,
  //         totalQuantity: totalQuantity,
  //       }
  //     })

  //     return response.status(200).json({
  //       code: 200,
  //       message: 'OK',
  //       customerData: customerData,
  //     })
  //   } catch (error) {
  //     return response.status(500).json({
  //       code: 500,
  //       message: 'ERROR',
  //       error: error.message,
  //     })
  //   }
  // }

  // masih test
  // public async getCustomersWithSalesAndSalesDet({ response }: HttpContextContract) {
  //   try {
  //     const customers = await Customer.query().has('sales').preload('sales', (query) => {
  //       query.preload('salesDets')
  //     })

  //     let grandTotal = new Decimal(0)

  //     const tableData = customers.map((customer, index) => {
  //       let totalQuantity = 0
  //       let subtotal = new Decimal(0)
  //       let discount = new Decimal(0)
  //       let shippingCost = new Decimal(0)
  //       let totalCost = new Decimal(0)

  //       customer.sales.forEach((sale) => {
  //         sale.salesDets.forEach((salesDet) => {
  //           totalQuantity += salesDet.quantity
  //         })

  //         subtotal = subtotal.plus(new Decimal(sale.subtotal || 0))
  //         discount = discount.plus(new Decimal(sale.discount || 0))
  //         shippingCost = shippingCost.plus(new Decimal(sale.shippingCost || 0))
  //         totalCost = totalCost.plus(new Decimal(sale.totalCost || 0))
  //       })

  //       grandTotal = grandTotal.plus(totalCost)

  //       return {
  //         no_transaksi: index + 1,
  //         tanggal: customer.sales[0]?.date,
  //         nama_Customer: customer.name,
  //         jumlah_barang: totalQuantity,
  //         sub_total: subtotal.toFixed(2),
  //         diskon: discount || 0,
  //         ongkir: shippingCost || 0,
  //         total: totalCost.toFixed(2),
  //       }
  //     })

  //     return response.status(200).json({
  //       code: 200,
  //       message: 'OK',
  //       tableData: tableData,
  //       grandTotal: grandTotal.toFixed(2),
  //     })
  //   } catch (error) {
  //     return response.status(500).json({
  //       code: 500,
  //       message: 'ERROR',
  //       error: error.message,
  //     })
  //   }
  // }

  public async getCustomersWithSalesAndSalesDet({ response }: HttpContextContract) {
    try {
      const customers = await Customer.query().has('sales').preload('sales', (query) => {
        query.preload('salesDets')
      })
  
      let grandTotal = new Decimal(0);
  
      const tableData = customers.flatMap((customer, index) => {
        return customer.sales.map((sale) => {
          const totalQuantity = sale.salesDets.reduce((total, salesDet) => {
            return total + salesDet.quantity
          }, 0)
  
          grandTotal = grandTotal.plus(new Decimal(sale.totalCost || 0));
  
          return {
            transaction_no: index + 1,
            date: sale.date,
            customer_name: customer.name,
            quantity: totalQuantity,
            subtotal: sale.subtotal || 0,
            discount: sale.discount || 0,
            shipping_cost: sale.shippingCost || 0,
            total_cost: sale.totalCost || 0,
          }
        })
      })
  
      return response.status(200).json({
        code: 200,
        message: 'OK',
        tableData: tableData,
        grandTotal: grandTotal.toFixed(2),
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

  public async updateSale({ params, request, response }: HttpContextContract) {
    try {
      const saleId = params.id
      const { customerId, items, discount, shippingCost, date } = request.only([
        'customerId',
        'items',
        'discount',
        'shippingCost',
        'date',
      ])
  
      // Cek apakah penjualan valid
      const sale = await Sales.find(saleId)
      if (!sale) {
        return response.status(404).json({
          code: 404,
          message: 'Not Found',
          error: 'Sale not found',
        })
      }
  
      // Cek apakah customer valid
      const customer = await Customer.find(customerId)
      if (!customer) {
        return response.status(404).json({
          code: 404,
          message: 'Not Found',
          error: 'Customer not found',
        })
      }
  
      // Mulai transaksi database
      const trx = await Database.transaction()
  
      try {
        // Hapus detail penjualan yang ada
        await sale.related('salesDets').query().delete()
  
        // Update data penjualan
        sale.customerId = customer.id
        sale.date = date ? new Date(date).toISOString() : sale.date
        sale.discount = discount || 0
        sale.shippingCost = shippingCost || 0
        sale.subtotal = 0
        sale.totalCost = 0
        await sale.save()
  
        // Iterasi dan tambahkan detail penjualan yang baru
        for (const itemData of items) {
          const { itemId, quantity } = itemData
  
          // Cek apakah item valid
          const item = await Item.find(itemId)
          if (!item) {
            await trx.rollback()
  
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
  
        await trx.commit()
  
        return response.status(200).json({
          code: 200,
          message: 'OK',
          sale: sale,
        })
      } catch (error) {
        await trx.rollback()
  
        return response.status(500).json({
          code: 500,
          message: 'ERROR',
          error: error.message,
        })
      }
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