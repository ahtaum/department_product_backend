import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code', 15).unique()
      table.dateTime('date')
      table.integer('customer_id').unsigned().references('customers.id').onDelete('CASCADE')
      table.decimal('subtotal')
      table.decimal('discount')
      table.decimal('shipping_cost')
      table.decimal('total_cost')
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
