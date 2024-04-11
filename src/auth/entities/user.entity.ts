import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({ unique: true, required: true })
    email: string;
    @Prop({ required: true })
    name: string;
    @Prop({ minlength: 6, required: true })
    password: string;
    @Prop({ default: true })
    isActice: boolean;
    @Prop({ type: [String], default: ['user'] })
    roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User)
