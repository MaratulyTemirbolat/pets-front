import Button from "../../shared/Buttons/Button";
import "./PetListItem.scss";
export default function PetListItem({pet, img}) {
  return (
    <div className="pet__card__list__item">
      <div className="pet__item__image__div">
        <img className="pet__item__image" src={img} alt={pet.name} />
      </div>
      <div className="pet__item__data">
        <div className="pet__item__data__name">{pet.name}</div>
        <div className="pet__item__date__creation">Birthday: {pet.birthday}</div>
        <div className="pet__item__button__view">
          <Button handleSuccess={() => {}} type="button" isEnable={true} text="View" />
        </div>
      </div>
    </div>
  );
}
