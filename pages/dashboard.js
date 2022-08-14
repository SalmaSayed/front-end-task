import { useState } from "react";
import { CircularProgress, Pagination, ThemeProvider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import SelectButton from "../components/SelectButton";
import UnitsTable from "../components/UnitsTable";
import styles from "../styles/dashboard.module.css";
import services from "../services";
import { useRouter } from "next/router";
import theme from "../public/assets/theme";

const totalUnits = 50;
const pageLimit = 10;

const Dashboard = ({ units }) => {
  const sortOptions = {
    "Unit ID": "unit_id",
    "Unit type": "unit_type",
    "Unit price": "total_price",
  };
  const [sortValue, setSortValue] = useState(Object.keys(sortOptions)[0]);
  const router = useRouter();

  let page = Number(router.query.page);
  if (page === 0 || Number.isNaN(page)) page = 1;

  const count = totalUnits / pageLimit;

  return (
    <div className="container">
      <nav className={styles.nav}>
        <Link href="/" target="_blank">
          <span className={styles.logo}>
            <Image src="/fav.png" alt="Sakneen Logo" width={25} height={25} />
          </span>
        </Link>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.subtitle}>Dashboard</h1>

        <div className={styles.breadcrumbs}>
          <span className={styles.logo}>
            <Image src="/home.png" alt="home icon" width={16} height={16} />
          </span>
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <span>Dashboard</span>
        </div>

        <div className={styles.controllers}>
          <span>
            <span className={styles.filter}>Filters by ID:</span>
            <input
              className={styles.input}
              placeholder="ex: 56487"
              onInput={(e) => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      ...(e.target.value !== "" && { id: e.target.value }),
                    },
                  },
                  null,
                  { scroll: false }
                );
              }}
            />
          </span>

          <span className={styles.sort}>
            <Image src="/sort.png" alt="sort icon" width={16} height={16} />
            <span>sort by:</span>
            <SelectButton
              value={sortValue}
              options={Object.keys(sortOptions)}
              onChange={(key) => {
                setSortValue(key);
                router.push(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      sort: sortOptions[key],
                    },
                  },
                  null,
                  { scroll: false }
                );
              }}
            />
          </span>
        </div>

        <div className={styles["table-container"]}>
          <UnitsTable units={units} />
        </div>

        <div className={styles.pagination}>
          <ThemeProvider theme={theme}>
            <Pagination
              count={count}
              color="primary"
              page={page}
              onChange={(e, page) => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, page },
                  },
                  null,
                  { scroll: false }
                );
              }}
            />
          </ThemeProvider>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { page, sort, id } = context.query;

  const { data: units } = await services.getUnits({
    params: {
      _page: page,
      _limit: pageLimit,
      _sort: sort,
      ///the endpoint does not filter by unitId
      unitId: id,
    },
  });
  return {
    props: {
      units,
    },
  };
}

export default Dashboard;
