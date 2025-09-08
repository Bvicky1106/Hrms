import { BrowserRouter, Route, Routes } from "react-router";
import { ROUTES } from "../constants";
import Home from "../components/Home/Home";
import ClientList from "../components/ClientMaster/ClientList";
import AddClient from "../components/ClientMaster/AddClient";
import EditClient from "../components/ClientMaster/EditClient";
import InvoicePage from "../components/Invoice/InvoicePage";
import InvoiceForm from "../components/Invoice/InvoiceAdd";
import InvoiceTable from "../components/Invoice/InvoiceTable";
import InvoiceEdit from "../components/Invoice/InvoiceEdit";
import TermAddMaster from "../components/TermMaster/TermAddMaster";
import TermListMaster from "../components/TermMaster/TermListMaster";
import TermEditMaster from "../components/TermMaster/TermEditMaster";
import ItemListMaster from "../components/ItemMaster/ItemListMaster";
import ItemAddMaster from "../components/ItemMaster/ItemAddMaster";
import ItemEditMaster from "../components/ItemMaster/ItemEditMaster";
import PaymentAdd from "../components/payments/PaymentAdd";
import PaymentTable from "../components/payments/PaymentTable";

import PaymentReceipt from "../components/payments/PaymentReceipt";
import InvoiceView from "../components/Invoice/InvoiceView";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CLIENT_LIST} element={<ClientList />} />
        <Route path={ROUTES.ADD_CLIENT} element={<AddClient />} />
        <Route path={ROUTES.EDIT_CLIENT} element={<EditClient />} />

        <Route path={ROUTES.INVOICE_PAGE} element={<InvoicePage />} />
        <Route path={ROUTES.INVOICE_ADD} element={<InvoiceForm />} />
        <Route path={ROUTES.INVOICE_TABLE} element={<InvoiceTable />} />
        <Route path={ROUTES.INVOICE_EDIT} element={<InvoiceEdit />} />
        <Route path={ROUTES.INVOICE_VIEW} element={<InvoiceView />} />

        <Route path={ROUTES.TERM_ADD} element={<TermAddMaster />} />
        <Route path={ROUTES.TERM_LIST} element={<TermListMaster />} />
        <Route path={ROUTES.TERM_EDIT} element={<TermEditMaster />} />
        <Route path={ROUTES.ITEM_LIST} element={<ItemListMaster />} />
        <Route path={ROUTES.ITEM_ADD} element={<ItemAddMaster />} />
        <Route path={ROUTES.ITEM_EDIT} element={<ItemEditMaster />} />
        <Route path={ROUTES.PAYMENT_ADD} element={<PaymentAdd />} />
        <Route path={ROUTES.PAYMENT_TABLE} element={<PaymentTable />} />

        <Route path={ROUTES.PAYMENT_RECIPT} element={<PaymentReceipt />} />

        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}
