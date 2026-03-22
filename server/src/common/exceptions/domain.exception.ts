import { HttpStatus } from '@nestjs/common';

export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: HttpStatus;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProfileNotFoundException extends DomainException {
  readonly code = 'PROFILE_NOT_FOUND';
  readonly statusCode = HttpStatus.NOT_FOUND;

  constructor(userId: string) {
    super(`Profile not found for user: ${userId}`);
  }
}

export class InvalidProfileStepException extends DomainException {
  readonly code = 'INVALID_PROFILE_STEP';
  readonly statusCode = HttpStatus.BAD_REQUEST;

  constructor(stepName: string, validSteps: string[]) {
    super(
      `Invalid profile step: "${stepName}". Valid steps are: ${validSteps.join(', ')}`,
    );
  }
}

export class ProfileIncompleteException extends DomainException {
  readonly code = 'PROFILE_INCOMPLETE';
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor() {
    super('Cannot mark profile as complete — not all steps have been filled');
  }
}
