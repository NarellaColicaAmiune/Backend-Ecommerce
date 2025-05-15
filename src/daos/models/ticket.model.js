import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const TicketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
})

TicketSchema.plugin(mongoosePaginate)

export default model("Ticket", TicketSchema)