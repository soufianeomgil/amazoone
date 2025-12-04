import { BadgeDollarSign, BadgeInfo, Heart, MapPin, ShoppingCart, UserRound } from "lucide-react";

export const ProfileItems = [
  {
     name: "mon compte",
     icon: UserRound,
     pathname:"/"
  },
  {
     name: "mes commandes",
     icon: ShoppingCart,
     pathname: "/"
  },   {
     name: "ma list d'envie",
     icon: Heart,
     pathname: "/"
  },  {
     name: "Carnet d'addresses",
     icon: MapPin,
     pathname: "/"
  }, 
   {
     name: "Information du compte",
     icon: BadgeInfo,
     pathname: "/customer/account/edit"
  }, 
  {
     name: "mes Coupons",
     icon: BadgeDollarSign,
     pathname:  "/"
 },
 
 //  {
 //     name: "LogOut",
 //     icon: LogOut,
 //     pathname: ""
 //  },
  
  
]