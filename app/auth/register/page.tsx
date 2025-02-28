import RegisterForm from "@/components/RegisterForm";
import { getUserTypes } from "@/data/getUserTypes";

export default async function Page() {
	const userTypes = await getUserTypes();
	return <RegisterForm userTypes={userTypes} />;
}
