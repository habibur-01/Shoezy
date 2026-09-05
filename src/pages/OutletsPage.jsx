import React from "react";
import Container from "../components/common/Container/Container";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import StoreOutlets from "../components/Shop/StoreOutlets";

const OutletsPage = () => {
  return (
    <Container>
      <Breadcrumb />
      <div className="py-6">
        <StoreOutlets />
      </div>
    </Container>
  );
};

export default OutletsPage;
