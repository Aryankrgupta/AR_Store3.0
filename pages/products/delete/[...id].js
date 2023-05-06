import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?='+id).then(response => {
            setProductInfo(response.data);
        });
    }, [id])
    function goBack() {
        router.push('/products');
    }
    async function deleteProduct() {
        await axios.delete('/api/products?id='+id);
        goBack();
    }
    return(
        <Layout>
            <h1>Do you really want to delete product {productInfo?.title} ?</h1>
            <div className="flex gap-2">
            <button className="btn-red" onClick={deleteProduct}>Yes</button>
            <button onClick={goBack} className="btn-default">No</button>
            </div>
        </Layout>
    )
}