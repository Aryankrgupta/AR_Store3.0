import axios from "axios"
import { useState, useEffect } from "react";
import Spinner from "./spinner";
import {subHours} from 'date-fns'
export default function AdminStatus() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
      axios.get('/api/orders').then(res => {
          setOrders(res.data);
          setIsLoading(false);
      })
    }, [])
    if (isLoading) {
        return(
            <div className="my-4">
                <Spinner fullWidth={true} />
            </div>
        )
    }

    function ordersTotal(orders) {
        let sum = 0;
        orders.forEach(order => {
            const {line_items} = order;
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount /100;
                sum += lineSum;
            })
        });
        return sum;
    }

    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24 * 7));
    const ordersMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24 * 30));

    return (
        <div className="">
            <h2>Orders</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">{ordersWeek.length} orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="tile-desc">{ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">&#8377;{ordersTotal(ordersToday).toLocaleString("en-IN")}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">&#8377;{ordersTotal(ordersWeek).toLocaleString("en-IN")}</div>
                    <div className="tile-desc">{ordersWeek.length} orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">&#8377;{ordersTotal(ordersMonth) >= 9999999 ? (ordersTotal(ordersMonth)/10000000).toFixed(1) + " crores" : ordersTotal(ordersMonth).toLocaleString("en-IN")}</div>

                    <div className="tile-desc">{ordersMonth.length} orders this month</div>
                </div>
            </div>
        </div>
    )
}