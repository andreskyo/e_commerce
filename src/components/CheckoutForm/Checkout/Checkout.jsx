import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { commerce } from '../../../lib/commerce'
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Dirección de Envío', 'Detalles del pago'];

const Checkout = ({ cart,  onCaptureCheckout,  }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false)
    const classes = useStyles();
  

    useEffect(() => {

        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                setCheckoutToken(token);

            } catch (error) {

            }
        };

        generateToken();

    }, [cart]);

    let Confirmation = () =>  (
        <>
            <div>
                <p>Gracias</p>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Pagina principal</Button>
        </>
    ) 


    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    const next = (data) => {
        setShippingData(data)
        nextStep();

    }
    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    return (
        <>

            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Verificar</Typography>
                    <Stepper activeStep={0} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>

        </>
    )
}

export default Checkout
