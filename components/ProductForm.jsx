import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images:existingImges,
  category:existingCategory,
  properties:existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImges || []);
  const [productProperties,setProductProperties] = useState(existingProperties || {});
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(existingCategory || '')
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);
  
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price, images, category, properties:productProperties };

    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }
  async function uploadImage(ev) {
    const files = ev.target?.files;
    setIsUpLoading(true);
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file)
      };
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links]
      })
    }
    setIsUpLoading(false);
  }
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    })
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Product Name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={ev => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 && categories.map(category => (
            <option  key={category._id} value={category._id}>{category.name}</option>
            )
        )}
      </select>
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
              <select value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
              >
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        {!!images?.length && images.map(link => (
          <div key={link} className="h-24">
            <img src={link} alt="" className="rounded-lg"/>
          </div>
        ))}
        {isUpLoading && (
          <div className="h-15 mt-6">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer inline-block text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImage} className="hidden" />
        </label>
        {!images?.length && <div>No photos for this Product.</div>}
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
