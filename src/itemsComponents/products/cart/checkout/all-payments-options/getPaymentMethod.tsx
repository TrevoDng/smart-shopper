import PaymentMethodSelector from "./PaymentMethodSelector";

export const getPaymentMethodSelector=()=> {

		const handleSelect=()=> {
			console.log("selected");
		}
		return (<PaymentMethodSelector 
					onSelect={handleSelect}
  					isOpen = {true}/>)
	}