import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Search, Refresh, FilterList, Visibility } from "@material-ui/icons";

import { getAuditLogs } from "services/auditLogs";
import styles from "./style.module.scss";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Filters
  const [filterEntity, setFilterEntity] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Date/Time Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilters, setShowDateFilters] = useState(false);

  // Detail Dialog
  const [detailDialog, setDetailDialog] = useState({ open: false, log: null });

  useEffect(() => {
    fetchAuditLogs();
  }, [page, rowsPerPage]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const offset = page * rowsPerPage;
      const response = await getAuditLogs(rowsPerPage, offset);
      
      if (response?.data?.auditTrailData) {
        setAuditLogs(response.data.auditTrailData);
        setTotalCount(response.data.totalCount || 0);
      } else if (response?.data?.message) {
        // Super admin access denied
        setError(response.data.message);
        setAuditLogs([]);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (log) => {
    setDetailDialog({ open: true, log });
  };

  const handleCloseDetail = () => {
    setDetailDialog({ open: false, log: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatValue = (value) => {
    if (!value) return "N/A";
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return value;
    }
  };

  const getStatusColor = (status) => {
    return status === "SUCCESS" ? "primary" : "secondary";
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = filterEntity === "" || log.entity === filterEntity;
    const matchesAction = filterAction === "" || log.action === filterAction;
    const matchesStatus = filterStatus === "" || log.status === filterStatus;

    // Date filtering
    let matchesDate = true;
    if (startDate || endDate) {
      const logDate = new Date(log.created_at);
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end date
        matchesDate = logDate >= start && logDate <= end;
      } else if (startDate) {
        const start = new Date(startDate);
        matchesDate = logDate >= start;
      } else if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = logDate <= end;
      }
    }

    return matchesSearch && matchesEntity && matchesAction && matchesStatus && matchesDate;
  });

  // Get unique values for filters
  const uniqueEntities = [...new Set(auditLogs.map((log) => log.entity))].filter(Boolean);
  const uniqueActions = [...new Set(auditLogs.map((log) => log.action))].filter(Boolean);

  if (loading) {
    return (
      <div className={styles["audit-logs"]}>
        <div className={styles["audit-logs__loading"]}>
          <CircularProgress size={48} />
          <Typography variant="body1" className={styles["audit-logs__loading-text"]}>
            Loading audit logs...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["audit-logs"]}>
      {/* Header */}
      <div className={styles["audit-logs__header"]}>
        <div className={styles["audit-logs__title-section"]}>
          <Typography variant="h4" className={styles["audit-logs__title"]}>
            Audit Logs
          </Typography>
          <Typography variant="body1" className={styles["audit-logs__subtitle"]}>
            Track all system activities and changes
          </Typography>
        </div>

        {/* Search and Actions */}
        <div className={styles["audit-logs__actions"]}>
          <TextField
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            className={styles["audit-logs__search"]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAuditLogs}
            className={styles["audit-logs__refresh"]}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles["audit-logs__filters"]}>
        <Tooltip title={showDateFilters ? "Hide Date Filters" : "Show Date Filters"}>
          <IconButton
            size="small"
            onClick={() => setShowDateFilters(!showDateFilters)}
            className={styles["audit-logs__filter-toggle"]}
            color={showDateFilters ? "primary" : "default"}
          >
            <FilterList />
          </IconButton>
        </Tooltip>

        <FormControl 
          variant="outlined" 
          size="small" 
          className={styles["audit-logs__filter"]}
          style={{ width: '220px', minWidth: '220px' }}
        >
          <InputLabel>Entity</InputLabel>
          <Select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            label="Entity"
          >
            <MenuItem value="">All Entities</MenuItem>
            {uniqueEntities.map((entity) => (
              <MenuItem key={entity} value={entity}>
                {entity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          size="small" 
          className={styles["audit-logs__filter"]}
          style={{ width: '220px', minWidth: '220px' }}
        >
          <InputLabel>Action</InputLabel>
          <Select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            label="Action"
          >
            <MenuItem value="">All Actions</MenuItem>
            {uniqueActions.map((action) => (
              <MenuItem key={action} value={action}>
                {action}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          variant="outlined" 
          size="small" 
          className={styles["audit-logs__filter"]}
          style={{ width: '220px', minWidth: '220px' }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="SUCCESS">Success</MenuItem>
            <MenuItem value="FAILURE">Failure</MenuItem>
          </Select>
        </FormControl>

        {(filterEntity || filterAction || filterStatus || startDate || endDate) && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setFilterEntity("");
              setFilterAction("");
              setFilterStatus("");
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Date/Time Filters - Collapsible */}
      {showDateFilters && (
        <div className={styles["audit-logs__date-filters"]}>
          <Typography variant="subtitle2" className={styles["audit-logs__date-filters-title"]}>
            Date Range Filter
          </Typography>
          <TextField
            label="Start Date"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="outlined"
            size="small"
            className={styles["audit-logs__date-input"]}
            style={{ width: '220px', minWidth: '220px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="outlined"
            size="small"
            className={styles["audit-logs__date-input"]}
            style={{ width: '220px', minWidth: '220px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {(startDate || endDate) && (
            <Button
              size="small"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear Dates
            </Button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" className={styles["audit-logs__error"]}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} className={styles["audit-logs__table-container"]}>
        <Table className={styles["audit-logs__table"]}>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" className={styles["audit-logs__no-data"]}>
                    {searchTerm || filterEntity || filterAction || filterStatus
                      ? "No audit logs match your filters"
                      : "No audit logs available"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className={styles["audit-logs__row"]}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell>
                    {log.user ? (
                      <div className={styles["audit-logs__user"]}>
                        <Typography variant="body2">{log.user.username}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.user.email}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        System / Unauthenticated
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.entity} 
                      size="small" 
                      className={styles["audit-logs__entity-chip"]}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action} 
                      size="small" 
                      variant="outlined"
                      className={styles["audit-logs__action-chip"]}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      size="small"
                      color={getStatusColor(log.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetail(log)}
                        className={styles["audit-logs__view-button"]}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        className={styles["audit-logs__dialog"]}
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {detailDialog.log && (
            <div className={styles["audit-logs__detail"]}>
              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  Timestamp:
                </Typography>
                <Typography variant="body1">
                  {formatDate(detailDialog.log.created_at)}
                </Typography>
              </Box>

              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  User:
                </Typography>
                <Typography variant="body1">
                  {detailDialog.log.user
                    ? `${detailDialog.log.user.username} (${detailDialog.log.user.email})`
                    : "System / Unauthenticated"}
                </Typography>
              </Box>

              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  Entity:
                </Typography>
                <Typography variant="body1">{detailDialog.log.entity}</Typography>
              </Box>

              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  Action:
                </Typography>
                <Typography variant="body1">{detailDialog.log.action}</Typography>
              </Box>

              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status:
                </Typography>
                <Chip
                  label={detailDialog.log.status}
                  color={getStatusColor(detailDialog.log.status)}
                />
              </Box>

              <Box className={styles["audit-logs__detail-item"]}>
                <Typography variant="subtitle2" color="textSecondary">
                  Value / Data:
                </Typography>
                <pre className={styles["audit-logs__detail-value"]}>
                  {formatValue(detailDialog.log.value)}
                </pre>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AuditLogs;

