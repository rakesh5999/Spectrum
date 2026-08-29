import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router';
import { useProduct } from '../hook/useProduct';

const SellerProductDetails = () => {

  const { productId } = useParams();
    const { handleGetProductById } = useProduct();
    const [product, setProduct] = useState(null)
  
    useEffect(() => {
      async function fetchProductDetails() {
        try {
          const data = await handleGetProductById(productId);
          setProduct(data);
        } catch (err) {
          console.error('Error fetching product details:', err);
        }
      }
      if (productId) fetchProductDetails();
    }, [productId]);

    console.log(product);
    

  return (
    <div>
      SellerProductDetails
    </div>
  )
}

export default SellerProductDetails
