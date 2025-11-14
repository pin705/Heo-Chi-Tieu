import React, { Suspense } from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./welcome";
import { Summary } from "./summary";
import { QuickAdd } from "./quick-add";
import { RecentTransactions } from "./recent-transactions";
import { Divider } from "components/divider";

const ExpenseHomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <Suspense>
          <Summary />
        </Suspense>
        <Divider />
        <QuickAdd />
        <Divider />
        <Suspense>
          <RecentTransactions />
        </Suspense>
        <Divider />
      </Box>
    </Page>
  );
};

export default ExpenseHomePage;
