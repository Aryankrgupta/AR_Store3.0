import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Settings({swal}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    })
  }, []);

  async function fetchAll() {
    await axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });
    await axios.get('/api/settings?name=featuredProdductId').then(res => {
        setFeaturedProductId(res.data.value);
    });
    await axios.get('/api/settings?name=shippingCharge').then(res => {
        setShippingCharge(res?.data?.value);
    });
  }

  async function saveSetting() {
    setSaveLoading(true);
    await axios.put('/api/settings', {
        name:'featuredProdductId',
        value: featuredProductId,
    })
    await axios.put('/api/settings', {
        name:'shippingCharge',
        value: shippingCharge,
    })

    setSaveLoading(false);
    await swal.fire({
        title:  'Settings saved',
        icon: "success",
      })
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {(isLoading) && (
          <Spinner fullWidth={true} />
      )}
      {(!isLoading) && (
        <>
          <label>Featured Product</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
          {products.length > 0 && products.map(product => (
            <option value={product._id}>{product.title}</option>
          )
          )}
          </select>
          <label>Shipping price(in INR)</label>
          <input type="number" value={shippingCharge} onChange={ev => setShippingCharge(ev.target.value)}/>
          <div>
            <button onClick={saveSetting} className="btn-primary">
            {saveLoading ? (<Spinner fullWidth={true} type={'save'} />) : 'Save Settings'}
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}


export default withSwal(({swal}) => (
    <Settings swal={swal}/>
))