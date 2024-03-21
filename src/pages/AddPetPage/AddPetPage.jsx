import AddNewPetForm from "../../components/forms/AddNewPetForm/AddNewPetForm";

function MainPage() {
  return (
    <div style={{width: "100%", display: "flex", justifyContent: "center"}} className="some__container">
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "center" }} className="add__pet__form__container">
        <AddNewPetForm />
      </div>
      
    </div>
  );
}

export default MainPage;
