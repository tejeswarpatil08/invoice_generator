import React, { useState } from 'react';
import './input.css';
import Invoice from './invoice';

const Input = () => {
  const [showInvoice, setShowInvoice] = useState(null);

  const [sellerDetails, setSellerDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNo: '',
    gstNo: ''
  });

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    stateCode: ''
  });

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    stateCode: ''
  });

  const [orderDetails, setOrderDetails] = useState({
    orderNo: '',
    orderDate: ''
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: '',
    invoiceDetails: '',
    invoiceDate: ''
  });

  const [reverseCharge, setReverseCharge] = useState(false);

  const [items, setItems] = useState([
    { description: '', unitPrice: 0, quantity: 0, discount: 0, taxRate: 18, netAmount: 0 }
  ]);

  const [signature, setSignature] = useState(null);

  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');

  const handleInputChange = (e, section, key) => {
    const value = e.target.value;
    switch (section) {
      case 'sellerDetails':
        setSellerDetails({ ...sellerDetails, [key]: value });
        break;
      case 'billingDetails':
        setBillingDetails({ ...billingDetails, [key]: value });
        break;
      case 'shippingDetails':
        setShippingDetails({ ...shippingDetails, [key]: value });
        break;
      case 'orderDetails':
        setOrderDetails({ ...orderDetails, [key]: value });
        break;
      case 'invoiceDetails':
        setInvoiceDetails({ ...invoiceDetails, [key]: value });
        break;
      case 'placeOfSupply':
        setPlaceOfSupply(value);
        break;
      case 'placeOfDelivery':
        setPlaceOfDelivery(value);
        break;
      default:
        break;
    }
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', unitPrice: 0, quantity: 0, discount: 0, taxRate: 18, netAmount: 0 }]);
  };

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const numberToWords = (num) => {
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const g = ['', 'thousand', 'million', 'billion', 'trillion'];

    let result = '';
    let j = 0;
    const convert = (n) => {
      if (n < 20) return a[n];
      let s = b[Math.floor(n / 10)];
      if (n % 10) s += '-' + a[n % 10];
      return s;
    };

    while (num > 0) {
      const k = num % 1000;
      if (k) {
        result = convert(k) + (g[j] ? ' ' + g[j] : '') + ' ' + result;
      }
      j++;
      num = Math.floor(num / 1000);
    }
    return result.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const computedItems = items.map(item => {
      const netAmount = ((item.unitPrice * item.quantity) - (item.unitPrice * item.quantity) * (item.discount * 0.01));
      const taxType = placeOfSupply === placeOfDelivery ? 'CGST & SGST' : 'IGST';
      const taxAmount = taxType === 'CGST & SGST'
        ? { CGST: netAmount * 0.09, SGST: netAmount * 0.09 }
        : { IGST: netAmount * 0.18 };
      const totalAmount = taxType === 'CGST & SGST'
        ? netAmount + taxAmount.CGST + taxAmount.SGST
        : netAmount + taxAmount.IGST;

      return {
        ...item,
        netAmount,
        taxType,
        taxAmount,
        totalAmount
      };
    });

    // Calculate total amounts

    let totalAmount = 0;
    for(let computedItem of computedItems) {
        totalAmount += computedItem.totalAmount;
    }

    // Create invoice object
    const invoice = {
      sellerDetails,
      billingDetails,
      shippingDetails,
      orderDetails,
      invoiceDetails,
      reverseCharge,
      items: computedItems,
      totalAmount,
      totalAmountInWords: numberToWords(totalAmount),
      placeOfSupply,
      placeOfDelivery,
      signature
    };

    setShowInvoice(invoice);
  };

  return (
    showInvoice == null ? (
      <form onSubmit={handleSubmit}>
        <h2>Seller Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={sellerDetails.name} onChange={(e) => handleInputChange(e, 'sellerDetails', 'name')} required />
          <input type="text" placeholder="Address" value={sellerDetails.address} onChange={(e) => handleInputChange(e, 'sellerDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={sellerDetails.city} onChange={(e) => handleInputChange(e, 'sellerDetails', 'city')} required />
          <input type="text" placeholder="State" value={sellerDetails.state} onChange={(e) => handleInputChange(e, 'sellerDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={sellerDetails.pincode} onChange={(e) => handleInputChange(e, 'sellerDetails', 'pincode')} required />
          <input type="text" placeholder="PAN No." value={sellerDetails.panNo} onChange={(e) => handleInputChange(e, 'sellerDetails', 'panNo')} required />
          <input type="text" className="full-width" placeholder="GST No." value={sellerDetails.gstNo} onChange={(e) => handleInputChange(e, 'sellerDetails', 'gstNo')} required />
        </div>

        <h2>Billing Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={billingDetails.name} onChange={(e) => handleInputChange(e, 'billingDetails', 'name')} required />
          <input type="text" placeholder="Address" value={billingDetails.address} onChange={(e) => handleInputChange(e, 'billingDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={billingDetails.city} onChange={(e) => handleInputChange(e, 'billingDetails', 'city')} required />
          <input type="text" placeholder="State" value={billingDetails.state} onChange={(e) => handleInputChange(e, 'billingDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={billingDetails.pincode} onChange={(e) => handleInputChange(e, 'billingDetails', 'pincode')} required />
          <input type="text" placeholder="State Code" value={billingDetails.stateCode} onChange={(e) => handleInputChange(e, 'billingDetails', 'stateCode')} required />
        </div>

        <h2>Shipping Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={shippingDetails.name} onChange={(e) => handleInputChange(e, 'shippingDetails', 'name')} required />
          <input type="text" placeholder="Address" value={shippingDetails.address} onChange={(e) => handleInputChange(e, 'shippingDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={shippingDetails.city} onChange={(e) => handleInputChange(e, 'shippingDetails', 'city')} required />
          <input type="text" placeholder="State" value={shippingDetails.state} onChange={(e) => handleInputChange(e, 'shippingDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={shippingDetails.pincode} onChange={(e) => handleInputChange(e, 'shippingDetails', 'pincode')} required />
          <input type="text" placeholder="State Code" value={shippingDetails.stateCode} onChange={(e) => handleInputChange(e, 'shippingDetails', 'stateCode')} required />
        </div>

        <h2>Order Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Order No." value={orderDetails.orderNo} onChange={(e) => handleInputChange(e, 'orderDetails', 'orderNo')} required />
          <input type="date" placeholder="Order Date" value={orderDetails.orderDate} onChange={(e) => handleInputChange(e, 'orderDetails', 'orderDate')} required />
        </div>

        <h2>Invoice Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Invoice No." value={invoiceDetails.invoiceNo} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceNo')} required />
          <input type="date" placeholder="Invoice Date" value={invoiceDetails.invoiceDate} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceDate')} required />
          <input placeholder="Invoice Details" value={invoiceDetails.invoiceDetails} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceDetails')} />
        </div>

        <h2>Items</h2>
        {items.map((item, index) => (
          <div className="form-group" key={index}>
            <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required />
            <input type="number" placeholder="Unit Price"  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} required />
            <input type="number" placeholder="Quantity"  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 0)} required />
            <input type="number" placeholder="Discount"  onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)} />
            <select value={item.taxRate} onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))}>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>

        <h2>Place Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Place of Supply" value={placeOfSupply} onChange={(e) => handleInputChange(e, 'placeOfSupply')} required />
          <input type="text" placeholder="Place of Delivery" value={placeOfDelivery} onChange={(e) => handleInputChange(e, 'placeOfDelivery')} required />
        </div>

        <h2>Signature</h2>
        <input type="file" onChange={handleFileChange} required />

        <div className="form-group">
          <label>
            <input type="checkbox" checked={reverseCharge} onChange={(e) => setReverseCharge(e.target.checked)} />
            Reverse Charge
          </label>
        </div>

        <button type="submit">Generate Invoice</button>
      </form>
    ) : (
      <Invoice invoiceData={showInvoice} />
    )
  );
};

export default Input;
