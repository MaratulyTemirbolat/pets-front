import { Link } from "react-router-dom";

import catImg from "../../../public/icons/pets/cat.svg";
import dogImg from "../../../public/icons/pets/dog.svg";
import "./PetCardList.scss";

import PetListItem from "./PetCard/PetListItem";
import Button from "../shared/Buttons/Button";

import { useEffect, useState } from "react";
import { useUserStore } from "../../store/user.store";
import { fetcher } from "../../services/helpers/fetcher";
import { petURL, TOKEN_KEY_NAME } from "../../services";
import { useNavigate } from "react-router-dom";

export default function PetCardList() {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const [user, isExistedAccessToken, getAccessToken, resetUser] = useUserStore(
    (state) => [
      state.user,
      state.isExistedAccessToken,
      state.getAccessToken,
      state.resetUser,
    ]
  );

  const getRandImg = (pet) => {
    return pet.breed["pet_type"] % 2 == 0 ? dogImg : catImg;
  };

  useEffect(() => {
    if (!user || !isExistedAccessToken()) navigate("/login");
    fetcher(petURL, {
      headers: {
        Authorization: `${TOKEN_KEY_NAME} ${getAccessToken()}`,
      },
    })
      .then((res) => {
        console.log(res.response.data);
        if (res.isOk) setPets([...res.response.data]);
      })
      .catch((reason) => alert("Error: ", reason));
  }, []);

  return (
    <div className="pet__card__list__container">
      <h2>
        Your pets {user && user["first_name"]}:{" "}
        <Button
          type="button"
          isEnable={true}
          handleSuccess={() => {
            resetUser();
            navigate("/login");
          }}
          text="Log out"
        />
      </h2>
      <div className="pet__cards__list">
        {pets.map((pet) => (
          <div key={pet.id}>
            <PetListItem
              pet={pet}
              img={pet.photo ? pet.photo : getRandImg(pet)}
            />
          </div>
        ))}
        <Link className="pet__card__add__new__link" to={"/addpet"}>
          <div className="pet__card__add__new">
            <div className="pet__card__add__new__circle">+</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
