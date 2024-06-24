import React, { useState } from 'react';
import './invoice.css';
import Logo from '../images/amazon-logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const resources = {
  en: {
    translation: {
      "Tax Invoice/Bill of Supply/Cash Memo": "Tax Invoice/Bill of Supply/Cash Memo",
      "Original for Recipient": "Original for Recipient",
      "Sold By": "Sold By",
      "Billing Address": "Billing Address",
      "Shipping Address": "Shipping Address",
      "Order Number": "Order Number",
      "Order Date": "Order Date",
      "Invoice Details": "Invoice Details",
      "Invoice Date": "Invoice Date",
      "TOTAL": "TOTAL",
      "Place of Supply": "Place of Supply",
      "Whether tax is payable under reverse charge": "Whether tax is payable under reverse charge",
      "Place of Delivery": "Place of Delivery",
      "Authorized Signatory": "Authorized Signatory"
    }
  },
  es: {
    translation: {
      "Tax Invoice/Bill of Supply/Cash Memo": "Factura Fiscal/Memo de Suministro/Nota de Efectivo",
      "Original for Recipient": "Original para el destinatario",
      "Sold By": "Vendido por",
      "Billing Address": "Dirección de facturación",
      "Shipping Address": "Dirección de envío",
      "Order Number": "Número de orden",
      "Order Date": "Fecha de la orden",
      "Invoice Details": "Detalles de la factura",
      "Invoice Date": "Fecha de la factura",
      "TOTAL": "TOTAL",
      "Place of Supply": "Lugar de suministro",
      "Whether tax is payable under reverse charge": "Si el impuesto se paga bajo cargo inverso",
      "Place of Delivery": "Lugar de entrega",
      "Authorized Signatory": "Firmante autorizado"
    }
  }
};

i18n.init({
  resources,
  lng: "en", // default language
  interpolation: {
    escapeValue: false
  }
});

const Invoice = ({ invoiceData }) => {
  const { t } = useTranslation();
  const [format, setFormat] = useState('pdf');

  const handleDownload = async () => {

    const invoiceElement = document.getElementById('invoice');

    if (format === 'pdf') {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
    } else if (format === 'image') {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'invoice.png';
      link.click();
    }
  };

  return (
    <div>
      <div id="invoice" className="invoice-container">
        <div className="header">
          <img src={Logo} alt="Company Logo" className="logo" />
          <div className="invoice-title">
            <h3>{t('Tax Invoice/Bill of Supply/Cash Memo')}</h3>
            <p>{t('Original for Recipient')}</p>
          </div>
        </div>

        <div className="details">
          <div className="sold-by">
            <h3 style={{ marginRight: '100px' }}>{t('Sold By')}:</h3>
            <div style={{ marginRight: '100px', marginTop: '-20px' }}>{invoiceData.sellerDetails.name}</div>
            <div>{invoiceData.sellerDetails.address}</div>
            <div>{invoiceData.sellerDetails.city}, {invoiceData.sellerDetails.state}, {invoiceData.sellerDetails.pincode}</div>
            <div style={{ marginRight: '100px' }}><b>PAN No:</b> {invoiceData.sellerDetails.panNo}</div>
            <div style={{ marginRight: '25px' }}><b>GST Registration No:</b> {invoiceData.sellerDetails.gstNo}</div>
          </div>

          <div className="address-section">
            <div className="billing-address">
              <h3>{t('Billing Address')}:</h3>
              <div>{invoiceData.billingDetails.name}</div>
              <div>{invoiceData.billingDetails.address}</div>
              <div>{invoiceData.billingDetails.city}, {invoiceData.billingDetails.state}, {invoiceData.billingDetails.pincode}</div>
              <div>{invoiceData.billingDetails.stateCode}</div>
            </div>

            <div className="shipping-address">
              <h3>{t('Shipping Address')}:</h3>
              <div>{invoiceData.shippingDetails.name}</div>
              <div>{invoiceData.shippingDetails.address}</div>
              <div>{invoiceData.shippingDetails.city}, {invoiceData.shippingDetails.state}, {invoiceData.shippingDetails.pincode}</div>
              <div>{invoiceData.shippingDetails.stateCode}</div>
            </div>
          </div>
        </div>

        <div className="invoice-meta">
          <div>{t('Order Number')}: {invoiceData.orderDetails.orderNo}</div>
          <div>{t('Order Date')}: {invoiceData.orderDetails.orderDate}</div>
          <div>{t('Invoice Details')}: {invoiceData.invoiceDetails.invoiceDetails}</div>
          <div>{t('Invoice Date')}: {invoiceData.invoiceDetails.invoiceDate}</div>
        </div>

        <div className="line-items">
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Net Amount</th>
                <th>Tax Rate</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>{item.netAmount}</td>
                  <td>2.5%</td> {/* Note: You may need to update this */}
                  <td>{item.taxAmount.CGST}</td>
                  <td>{item.taxAmount.SGST}</td>
                  <td>{item.taxAmount.IGST}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="totals">
          <div>{t('TOTAL')}: ₹{invoiceData.totalAmount}</div>
        </div>

        <div className="footer">
          <div>{t('Place of Supply')}: {invoiceData.placeOfSupply}</div>
          <div>{t('Whether tax is payable under reverse charge')}: {invoiceData.reverseCharge ? 'Yes' : 'No'}</div>
        </div>
        <div className="footer">
          <div>{t('Place of Delivery')}: {invoiceData.placeOfDelivery}</div>
          <div className="signature">
            For {invoiceData.sellerDetails.name} <br />
            {t('Authorized Signatory')}
          </div>
        </div>
      </div>

      <div className="download-options">
        <label>
          Select format:
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>
        </label>

      </div>

      <button onClick={handleDownload} className="download-button">Download</button>
    </div>
  );
};

export default Invoice;
