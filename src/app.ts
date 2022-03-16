import * as express from 'express';
import {Request,Response} from 'express';
import * as cors from 'cors';
import "reflect-metadata";

import { createConnection } from "typeorm";
import { Product } from './entity/product';

createConnection().then(db=>{

    const productRepository= db.getRepository(Product);
    const app = express();

    app.use(cors([{
        origin:['http://localhost:3000','http://localhost:4200']
    }]));
    app.use(express.json());
    
    app.get('/api/product',async(req:Request,resp: Response)=>{
        const products = await productRepository.find();
        resp.json(products);
    });

    app.post('/api/product',async(req:Request,resp: Response)=>{
        try {
            const product = await productRepository.create(req.body);
            const result = await productRepository.save(product);
            resp.send(result);
        } catch (error) {
            resp.send(error.sqlMessage);
        }
    });

    app.get('/api/product/:id',async(req:Request,resp: Response)=>{
    
            const products = await productRepository.findOne(req.params.id);
            resp.send(products);
     
    });

    app.put('/api/product/:id',async(req:Request,resp: Response)=>{
        try {
            const products = await productRepository.findOne(req.params.id);
                productRepository.merge(products,req.body);
            const result = productRepository.save(products);

            resp.send(result);
       } catch (error) {
            resp.send(error.sqlMessage);
        }
    });

    app.delete('/api/product/:id',async(req:Request,resp: Response)=>{
        const result = await productRepository.delete(req.params.id);
        resp.send(result);
 
});

app.post('/api/product/:id/likes',async(req:Request,resp: Response)=>{
    const product = await productRepository.findOne(req.params.id);
    product.likes++;
    const result = await productRepository.save(product);
    resp.send(result);

});

    
    console.log('Listening to port 8000');
    
    app.listen(8000);
});

