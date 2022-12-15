import { QrCode, QrCodeOutlined } from "@mui/icons-material"
import { Alert, Box, Button, Modal, Snackbar, Stack, Typography } from "@mui/material"
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const style = {
    position: 'absolute' ,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const QrCodeAction = ({ fetchData }) => {
    const localSt = localStorage.getItem("token");
    const host = `https://oms-fa22se19.azurewebsites.net`;

    const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [qrCode, setQrCode] = useState('')

  const [showToast, setShowToast] = useState(false)

  const ref = useRef(null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    ref.current.focus()
    await handleCheckinReservation(qrCode)
  }


  async function handleCheckinReservation(id) {
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .get(host + `/api/v1/Reservations/` + id + `/checkin`, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setShowToast(true);
          setQrCode('');
          fetchData();
          handleClose();
        }
      })
      .catch((error) => {
        console.log(error)
        setQrCode('')
      });
  }

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowToast(false);
  };

  useEffect(() => {
   setQrCode('')
  }, [open]);

  return (
   <>
   <Button variant="outlined" color="secondary"  startIcon={<QrCodeOutlined />} onClick={handleOpen}>Checkin via QR</Button>
   <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
>
    <Box  sx={style}>

  <Stack justifyContent="center"
  alignItems="center" spacing={4}>
    <Typography id="modal-modal-title" variant="h4" component="h2">
      Checkin via QR Code
    </Typography>

    <QrCode sx={{ fontSize: 120 }} />
  </Stack>
  <form
						style={{ opacity: 0, position: 'fixed' }}
						onSubmit={handleSubmit}
					>
						<input
                        ref={ref}
							value={qrCode}
                            onChange={(e) => setQrCode(e.target.value)}
							onBlur={(e) => e.currentTarget.focus()}
                            autoFocus={true}
							autoComplete="off"
						/>
						<button hidden type="submit" />
					</form>
    <Snackbar open={showToast}  onClose={handleCloseToast}>
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
        Successfully checkin!
        </Alert>
      </Snackbar>
    </Box>
</Modal>
   </>
  )
}
export default QrCodeAction
