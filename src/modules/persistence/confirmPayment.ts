import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { addTransaction } from '../../firebase/services/Transactions';
import { updateProduct } from '../../firebase/services/Products';

const confirmPayment = (req:Request, res:Response) => {
    const { products } = req.body;
    const currentData = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let count = false;

    try {
        products.forEach(product => { 
            addTransaction({
                id: product.id,
                product_name: product.product_name,
                user_id: product.user_id,
                data: currentData,
                status:"success",
            }).catch(err => { 
                count = true;
            });
            const data:any = {
                id: product.id,
                forSale: false,
                user_id: product.user_id,
            };
            updateProduct(data);
        });
    
        setTimeout(() => { 
            if (count === true) { 
                return res.status(400).json({message:'Error in operation'});
            }
            return res.status(200).json({message:"Success in operation"});
        },3000)
    } catch (error) {
        return res.status(200).json({message:error.message});
    }
}

export default confirmPayment;