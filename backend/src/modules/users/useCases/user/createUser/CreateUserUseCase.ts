import { Hash } from "crypto";
import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../../dtos/ICreateUserDTO";
import IUsersRepository from "../../../infra/typeorm/repositories/IUsersRepository";
import { hash } from "bcrypt";
import { AppError } from "../../../../../shared/errors/AppError";

@injectable()
class CreateUserUseCase {
    constructor
        ( @inject("UsersRepository")
         private usersRepository: IUsersRepository) { }

    async execute({ name, email, cpf, password, cellPhone, birthDate }: ICreateUserDTO): Promise<void> {
        const passwordHash = await hash(password, 8);

        const userEmailAlreadyExists = await this.usersRepository.findByEmail(email);
        const userCPFAlreadyExists = await this.usersRepository.findByCPF(cpf);

        if (userEmailAlreadyExists) {
            throw new AppError("Email Already Exists", 400)
        }

        if(userCPFAlreadyExists){
            throw new AppError("CPF Already Exists", 400)
        }

        const userDB = await this.usersRepository.create({
            name, email, cpf, password: passwordHash, cellPhone, birthDate
        })

        return userDB
    }
}

export default CreateUserUseCase