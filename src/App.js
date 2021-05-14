import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';

const types = {
  'ASAS': { description: '最新実況天気図', },
  'FSAS24': { description: '最新24時間予想図', },
  'FSAS48': { description: '最新48時間予想図', },
  'AUPA20': { description: 'アジア太平洋200hPa高度・気温・風・圏界面天気図', },
  'AUPA25': { description: 'アジア太平洋250hPa高度・気温・風天気図', },
  'AUPN30': { description: '北太平洋300hPa高度・気温・風天気図', },
  'AUPQ35': { description: 'アジア500hPa・300hPa高度・気温・風・等風速線天気図', },
  'AUPQ78': { description: 'アジア850hPa・700hPa高度・気温・風・湿数天気図', },
  'AXFE578': { description: '極東850hPa気温・風、700hPa上昇流／500hPa高度・渦度天気図', },
  'AXJP130/AXJP140': { description: '高層断面図（風・気温・露点等）東経130度／140度解析', },
  'AXJP130': { description: '高層断面図（風・気温・露点等）東経130度／140度解析', },
  'AUXN50': { description: '北半球500hPa高度・気温天気図', },
  'FEAS/FEAS50': { description: 'アジア地上気圧、850hPa気温／500hPa高度・渦度天気図', },
};

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const columns = [
  { field: 'id', headerName: 'No.', valueFormatter: ({ value }) => (value + 1), width: 60, sortable: false, },
  { field: 'datetime', headerName: 'last update', valueFormatter: ({ value }) => moment(value).format(), width: 220, sortable: true, },
  { field: 'type', headerName: 'type', type: 'string', width: 160, sortable: true, },
  { field: 'description', headerName: 'description', valueGetter: (params) => (types[params.getValue('type')].description), width: 500, sortable: true, },
  { field: "url", headerName: "file", width: 60, renderCell: ({ value }) => (<a href={value}>pdf</a>), },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh'
  },
  headerGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '20',
  },
  dataGrid: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '100%',
    height: 'calc(100% - 60px)',
  },
  title: {
    padding: '0.2em 0.5em',
    margin: 0,
  }
}));

function App() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [pageParams, setPageParams] = useState({ pageSize: Number(process.env.REACT_APP_COUNT || 100), page: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await query(pageParams.pageSize, pageParams.pageSize * pageParams.page);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await query(pageParams.pageSize, pageParams.pageSize * pageParams.page);
      setLoading(false);
    })();
  }, [pageParams]);

  const query = async (limit, offset) => {
    return axios.get(`${apiUrl}/?limit=${limit}&offset=${offset}`)
      .then((response) => {
        return response.data;
      })
      .then(entities => {
        setItems(entities.map((x, i) => ({ id: i + offset, ...x })));       // リスト表示するためユニークな番号を付けて返す。
      })
      .catch((response) => {
        console.error(response);
        alert(response);
      });
  };

  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={12} className={classes.headerGrid} >
        <h1 className={classes.title}>JMA chart</h1>
      </Grid>
      <Grid item xs={12} className={classes.dataGrid}>
        <DataGrid
          rows={items}
          columns={columns}
          disableColumnMenu={true}
          headerHeight={30}
          rowHeight={30}
          pagination
          pageSize={pageParams.pageSize}
          rowCount={10000}
          paginationMode="server"
          onPageSizeChange={(param) => { setPageParams(param); }}
          onPageChange={(param) => { setPageParams(param); }}
          loading={loading}
          rowsPerPageOptions={[10, 50, 100, 500, 1000]}
          hideFooterSelectedRowCount={true}
        />
      </Grid>
    </Grid>
  );
}

export default App;
