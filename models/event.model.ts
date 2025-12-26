import { model, models, Schema } from "mongoose";
export interface IEvent {
    userId: Schema.Types.ObjectId;
    event:  "VIEW_PRODUCT" |"ADD_TO_CART" |"WISHLIST" |"PURCHASE" |"REVIEW" |"SEARCH",
    productId: Schema.Types.ObjectId;
    tags: string[];
    value: number;
    createdAt: Date
}
const UserEventSchema = new Schema<IEvent>({
  userId: { type: Schema.Types.ObjectId, index: true },
  event: {
    type: String,
    enum: [
      "VIEW_PRODUCT",
      "ADD_TO_CART",
      "WISHLIST",
      "PURCHASE",
      "REVIEW",
      "SEARCH"
    ],
    required: true
  },
  productId: Schema.Types.ObjectId,
  tags: [String],
  value: { type: Number, default: 1 }, // signal strength
  createdAt: { type: Date, default: Date.now }
})

const Event = models.Event || model<IEvent>("Event", UserEventSchema)
export default Event;