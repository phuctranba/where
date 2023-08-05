export interface TypedUser {
    "bio"?:string,
    "createdAt"?:string,
    "createdBy"?:string,
    "display_name"?:string,
    "lastActive"?:string,
    "updatedAt"?:string,
    "user_achivement_count"?:number,
    "user_address"?:string,
    "user_address_city"?:string,
    "user_address_district"?:string,
    "user_address_ward"?:string,
    "user_avatar"?:string,
    "user_birthday"?:string,
    "user_email"?:string,
    "user_gender"?:string,
    "user_id"?:string,
    "user_login"?:string,
    "user_numberphone"?:string,
    "user_rate"?:number,
    "user_rate_count"?:number,
    "user_status"?: number
}


export interface TypedTransaction {
    transaction_id: string;
    transaction_value: number;
    transaction_ref?: string;
    transaction_note?: string;
    transaction_condition: string;
    transaction_current_balance: number;
    transaction_new_balance: number;
    // transaction_method: TRANSACTION_METHOD;
    object_id?: string;
    createAt: string;
    updateAt?: string;
    service_name?: string;
}

export interface TypedPlan {
    amount_of_day: number
    country: string
    createdAt: string
    description: string
    google_store_product_id: string
    handle: string
    handle_id: string
    image: string
    name: string
    price: number
    status: number
    type: string
    updatedAt: string
    version: string
    currency: string
    _id: string
}

export interface TypedLoginSSOParams {
    access_token: string | null;
    device_uuid?: string;
    device_type?: string;
    device_signature?: string;
    full_name?: string;
}

export interface TypedLoginEmailPasswordParams {
    user_email: string;
    password: string;
    remember?: number;
    device_uuid?: string;
    device_type?: string;
    device_signature?: string;
}

export interface TypedSignUpEmailPasswordParams {
    user_email: string;
    password: string;
    display_name: string;
    // user_referrer: number;
}

export interface TypedMediaUpload{
    "media_id": string,
    "media_filename": string,
    "media_filetype": string
}
