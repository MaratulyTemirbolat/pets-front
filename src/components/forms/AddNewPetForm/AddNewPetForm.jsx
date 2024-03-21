import React, { useState, useEffect, useRef, useMemo } from "react";
import { useUserStore } from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import {
  petTypesURL,
  TOKEN_KEY_NAME,
  bloodURL,
  petURL,
} from "../../../services/index";
import { fetcher } from "../../../services/helpers/fetcher";

import { DatePicker } from "react-rainbow-components";
import Button from "../../shared/Buttons/Button";

import "./AddNewPetForm.scss";

function AddNewPetForm() {
  const [user, isExistedAccessToken, getAccessToken] = useUserStore((state) => [
    state.user,
    state.isExistedAccessToken,
    state.getAccessToken,
  ]);
  const [petDetails, setPetDetails] = useState({
    photo: undefined,
    name: "",
    birthday: undefined,
    breed_id: undefined,
    color: "",
    weight: undefined,
    is_chipped: false,
    blood_type_id: undefined,
    last_checkup: undefined,
    last_blood_donation: undefined,
  });
  const [petErrors, setPetErrors] = useState({
    photo: [],
    name: [],
    birthday: [],
    breed_id: [],
    color: [],
    weight: [],
    is_chipped: [],
    blood_type_id: [],
    last_checkup: [],
    last_blood_donation: [],
  });
  const [datesDetails, setDatesDetails] = useState({
    birthday: undefined,
    last_checkup: undefined,
    last_blood_donation: undefined,
  });
  const navigate = useNavigate();
  const [selectedPetTypeId, setSelectedPetTypeId] = useState("");
  const [petTypes, setPetTypes] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3047/3047928.png"
  );
  const fileInputRef = useRef(null);
  const INITIAL_FORM_STATE = 1;
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const SUBMIT_STATE = 2;
  const PET_MAX_WEIGHT = 1000000,
    PET_MIN_WEIGHT = 1,
    petsStates = ["Personal data", "Medical data"];

  const isPersonalInfoCompletedState = useMemo(() => {
    for (let name of ["name", "birthday", "breed_id", "color"]) {
      if (!petDetails[name]) return false;
    }
    return true;
  }, [[petTypes]]);

  const isMedicalDataCompletedState = useMemo(() => {
    for (let name of ["weight", "blood_type_id"]) {
      if (!petDetails[name]) return false;
    }
    return true;
  });

  useEffect(() => {
    console.log("useEffect");
    console.log(isExistedAccessToken(), getAccessToken());
    if (!isExistedAccessToken()) navigate("/login");

    fetcher(petTypesURL, {
      headers: {
        Authorization: `${TOKEN_KEY_NAME} ${getAccessToken()}`,
      },
    })
      .then((res) => {
        if (res.isOk) setPetTypes(res.response.data);
        else {
          alert("Error appeared while fetching pets' types data");
        }
      })
      .catch((reason) => alert("Error: ", reason));

    fetcher(bloodURL, {
      headers: {
        Authorization: `${TOKEN_KEY_NAME} ${getAccessToken()}`,
      },
    })
      .then((res) => {
        if (res.isOk) setBloodTypes(res.response.data);
        else {
          alert("Error appeared while fetching blood's data");
        }
      })
      .catch((reason) => alert("Error: ", reason));
    setBloodTypes(bloodTypes);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetDetails({ ...petDetails, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const handlePetTypeChange = (e) => {
    setSelectedPetTypeId(e.target.value);
    console.log(e.target.value);
    // Reset breed in petDetails since pet type has changed
    setPetDetails((prev) => ({ ...prev, breed_id: "" }));
  };

  const handleChange = (e) => {
    setPetDetails({ ...petDetails, [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleDateChange = (name, date) => {
    setDatesDetails({ ...datesDetails, [name]: date });
    console.log(date);
    let stringFormatedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    setPetDetails({ ...petDetails, [name]: stringFormatedDate });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(petDetails);
    fetcher(petURL, {
      method: "POST",
      headers: {
        Authorization: `${TOKEN_KEY_NAME} ${getAccessToken()}`,
        "Content-Type": "application/json; charset=UTF-8; multipart/form-data;",
      },
      body: JSON.stringify(petDetails),
    })
      .then((res) => {
        if (res.isOk) {
          alert("Congratulations! You have successfully added your pet!");
          navigate("/");
        } else {
          alert(
            "Some error appeared! See details under the corresponded section!"
          );
          setPetErrors({ ...res["response"]["response"] });
          setFormState(INITIAL_FORM_STATE);
        }
        console.log(res);
      })
      .catch((reason) => console.log("Sudden Error appeared", reason));
  };
  // Find selected pet type object based on selectedPetTypeId
  const selectedPetType = petTypes.find(
    (pt) => pt.id.toString() === selectedPetTypeId
  );
  console.log(petDetails);

  return (
    <form onSubmit={handleSubmitForm} id="msform">
      <div className="progress__container">
        <div className="progress__wrapper">
          <ul id="progressbar">
            {petsStates.map((value, index) => (
              <li key={index} className={index < formState ? "active" : ""}>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {formState == 1 && (
        <fieldset>
          <h2 className="fs-title">Personal Data</h2>
          <h3 className="fs-subtitle">Tell us more about your pet</h3>
          <div className="add__new__pet__form__field add__pet__photo__row">
            <label htmlFor="photo">
              <img
                src={photoPreview}
                alt="Pet preview"
                onClick={handlePhotoClick}
                className="add__new__pet__photo__preview"
              />
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ opacity: 0 }}
              // style={{ display: "none" }}
            />
            {petErrors.photo && (
              <ul className="add__pet__input__errors">
                {petErrors.photo.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="form__group field add__new__pet__form__field">
            <input
              type="input"
              className="form__field"
              placeholder="Pet's name"
              name="name"
              onChange={handleChange}
              value={petDetails.name}
              id="name"
              required
            />
            <label htmlFor="name" className="form__label">
              Pet's name
            </label>
            {petErrors.name && (
              <ul className="add__pet__input__errors">
                {petErrors.name.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form__group field add__new__pet__form__field">
            <input
              type="input"
              className="form__field"
              placeholder="Pet's color"
              name="color"
              id="color"
              onChange={handleChange}
              value={petDetails.color}
              required
            />
            <label htmlFor="color" className="form__label">
              Pet's color
            </label>
            {petErrors.color && (
              <ul className="add__pet__input__errors">
                {petErrors.color.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form__group field add__new__pet__form__field">
            <select
              name="petType"
              required
              className="minimal__select"
              onChange={handlePetTypeChange}
              value={selectedPetTypeId}
            >
              <option value="">Select a pet type</option>
              {petTypes.map(
                (pt) =>
                  !pt.is_deleted && (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  )
              )}
            </select>
            {petErrors.breed_id && (
              <ul className="add__pet__input__errors">
                {petErrors.breed_id.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          {selectedPetTypeId && (
            <div className="form__group field add__new__pet__form__field">
              <select
                name="breed_id"
                required
                className="minimal__select"
                onChange={handleChange}
                value={petDetails.breed_id}
              >
                <option value="">Select a Breed</option>
                {selectedPetType &&
                  selectedPetType.breeds.map(
                    (breed) =>
                      !breed.is_deleted && (
                        <option key={breed.id} value={breed.id}>
                          {breed.name}
                        </option>
                      )
                  )}
              </select>
              {petErrors.breed_id && (
                <ul className="add__pet__input__errors">
                  {petErrors.breed_id.map((errorMsg, index) => (
                    <li key={index}>{errorMsg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="form__group field add__pet__birthday add__new__pet__form__field">
            {/* <label htmlFor="date__birthday">Birthday</label> */}
            <DatePicker
              id="date__birthday"
              className="date__picker__pet__add"
              name="birthday"
              value={datesDetails.birthday}
              onChange={(date) => handleDateChange("birthday", date)}
              formatStyle="large"
              placeholder="Pet's birthday"
            />
            {petErrors.birthday && (
              <ul className="add__pet__input__errors">
                {petErrors.birthday.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          {!isPersonalInfoCompletedState && (
            <div className="errors">You haven't filled all the fields</div>
          )}
          <Button
            text="Next"
            isEnable={isPersonalInfoCompletedState}
            handleSuccess={() => setFormState(formState + 1)}
            type="button"
          />
        </fieldset>
      )}
      {formState == 2 && (
        <fieldset>
          <h2 className="fs-title">Medical data</h2>
          <h3 className="fs-subtitle">
            Give more information about pet's health
          </h3>
          <div className="form__group field add__new__pet__form__field">
            <input
              type="number"
              className="form__field"
              placeholder="Pet's weight"
              name="weight"
              id="weight"
              min={PET_MIN_WEIGHT}
              max={PET_MAX_WEIGHT}
              // value={petDetails.weight}
              onChange={handleChange}
              required
            />
            <label htmlFor="weight" className="form__label">
              Pet's weight (grams)
            </label>
            {petErrors.weight && (
              <ul className="add__pet__input__errors">
                {petErrors.weight.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form__group field add__new__pet__form__field">
            <select
              name="blood_type_id"
              required
              className="minimal__select"
              onChange={handleChange}
              value={petDetails.blood_type_id}
            >
              <option value="">Select a pet's blood type</option>
              {bloodTypes.map(
                (blood) =>
                  !blood.is_deleted && (
                    <option key={blood.id} value={blood.id}>
                      {blood.name}
                    </option>
                  )
              )}
            </select>
            {petErrors.blood_type_id && (
              <ul className="add__pet__input__errors">
                {petErrors.blood_type_id.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form__group field add__pet__birthday add__new__pet__form__field">
            {/* <label htmlFor="date__birthday">Last checkup</label> */}
            <DatePicker
              id="date__last__checkup"
              value={datesDetails.last_checkup}
              onChange={(date) => handleDateChange("last_checkup", date)}
              formatStyle="large"
              placeholder="Last checkup (optional)"
            />
            {petErrors.last_checkup && (
              <ul className="add__pet__input__errors">
                {petErrors.last_checkup.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form__group field add__pet__birthday add__new__pet__form__field">
            {/* <label htmlFor="date__birthday">Last blood donation</label> */}
            <DatePicker
              id="date__last__donation"
              // value={petDetails.birthday}
              onChange={(date) => handleDateChange("last_blood_donation", date)}
              formatStyle="large"
              placeholder="Last blood donation (optional)"
              value={datesDetails.last_blood_donation}
            />
            {petErrors.last_blood_donation && (
              <ul className="add__pet__input__errors">
                {petErrors.last_blood_donation.map((errorMsg, index) => (
                  <li key={index}>{errorMsg}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="add__pet__buttons">
            <Button
              text="Previous"
              isEnable={true}
              type="button"
              handleSuccess={() => setFormState(formState - 1)}
            />
            <Button
              text="Submit data"
              isEnable={isMedicalDataCompletedState}
              handleSuccess={() => console.log("Form submitted!")}
            />
          </div>
        </fieldset>
      )}
    </form>
  );
}

export default AddNewPetForm;
