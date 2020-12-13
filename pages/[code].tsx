import Wrapper from "../components/Wrapper";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from 'axios';
import constants from "../constants";

declare var Stripe;

const Home = () => {
    const router = useRouter();
    const {code} = router.query;
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');

    useEffect(() => {
        if (code !== undefined) {
            (
                async () => {
                    const response = await axios.get(`${constants.endpoint}/links/${code}`);

                    const data = response.data.data;

                    setUser(data.user);

                    setProducts(data.products);

                    setQuantities(data.products.map(p => {
                        return {
                            product_id: p.id,
                            quantity: 0
                        }
                    }));
                }
            )();
        }
    }, [code]);

    const quantity = (id: number) => {
        const q = quantities.find(q => q.product_id === id);

        return q ? q.quantity : 0;
    }

    const change = (id: number, quantity: number) => {
        setQuantities(quantities.map(q => {
            if (q.product_id === id) {
                return {
                    product_id: id,
                    quantity
                }
            }

            return q;
        }));
    }

    const total = () => {
        let t = 0;

        quantities.forEach(q => {
            const product = products.find(p => p.id === q.product_id);
            t += q.quantity * parseFloat(product.price);
        });

        return t;
    }

    const submit = async (e) => {
        e.preventDefault();

        const response = await axios.post(`${constants.endpoint}/orders`, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            address: address,
            address2: address2,
            country: country,
            city: city,
            zip: zip,
            code: code,
            items: quantities
        });

        const stripe = new Stripe(constants.stripe_key);

        stripe.redirectToCheckout({
            sessionId: response.data.id
        });
    }

    return (
        <Wrapper>
            <div className="py-5 text-center">
                <h2>Welcome</h2>
                <p className="lead">{user?.first_name} {user?.last_name} has invited you to buy this item(s).</p>
            </div>

            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Products</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {products.map(p => {
                            return (
                                <div key={p.id}>
                                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                                        <div>
                                            <h6 className="my-0">{p.title}</h6>
                                            <small className="text-muted">{p.description}</small>
                                        </div>
                                        <span className="text-muted">${p.price}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                                        <div>
                                            <h6 className="my-0">Quantity</h6>
                                        </div>

                                        <input type="number" min="0" className="text-muted form-control"
                                               style={{width: '65px'}}
                                               defaultValue={quantity(p.id)}
                                               onChange={e => change(p.id, parseInt(e.target.value))}
                                        />
                                    </li>
                                </div>
                            )
                        })}

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (USD)</span>
                            <strong>${total()}</strong>
                        </li>
                    </ul>
                </div>
                <div className="col-md-8 order-md-1">
                    <h4 className="mb-3">Payment Info</h4>
                    <form className="needs-validation" onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName">First name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="First Name"
                                       onChange={e => setFirstName(e.target.value)}
                                       required/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName">Last name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                                       onChange={e => setLastName(e.target.value)}
                                       required/>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="you@example.com"
                                   onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address">Address</label>
                            <input type="text" className="form-control" id="address" placeholder="1234 Main St"
                                   onChange={e => setAddress(e.target.value)}
                                   required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address2">Address 2 <span
                                className="text-muted">(Optional)</span></label>
                            <input type="text" className="form-control" id="address2"
                                   onChange={e => setAddress2(e.target.value)}
                                   placeholder="Apartment or suite"/>
                        </div>

                        <div className="row">
                            <div className="col-md-5 mb-3">
                                <label htmlFor="country">Country</label>
                                <input type="text" className="form-control" id="country" placeholder="Country"
                                       onChange={e => setCountry(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="city">City</label>
                                <input type="text" className="form-control" id="city" placeholder="City"
                                       onChange={e => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="zip">Zip</label>
                                <input type="text" className="form-control" id="zip" placeholder="Zip" required
                                       onChange={e => setZip(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg btn-block" type="submit">Checkout</button>
                    </form>
                </div>
            </div>
        </Wrapper>
    )
};

// @ts-ignore
export default Home;
