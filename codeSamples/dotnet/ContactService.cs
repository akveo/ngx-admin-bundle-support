/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.Services;
using Common.Services.Infrastructure;
using Common.Utils;
using IoT.DTO;
using IoT.Entities.System;
using IoT.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IoT.Services
{
    public class ContactService : BaseService, IContactService
    {
        protected readonly IContactRepository contactRepository;
        protected readonly IContactPhotoRepository contactPhotoRepository;

        public ContactService(ICurrentContextProvider contextProvider, IContactRepository contactRepository, IContactPhotoRepository contactPhotoRepository)
            : base(contextProvider)
        {
            this.contactRepository = contactRepository;
            this.contactPhotoRepository = contactPhotoRepository;
        }

        public async Task<IEnumerable<ContactDTO>> GetAllContacts(ContactFilter filter)
        {
            var contacts = await contactRepository.GetList(filter, Session);
            return contacts.MapTo<IEnumerable<ContactDTO>>();
        }

        public async Task<byte[]> GetContactPhoto(int contactId)
        {
            var photoContent = await contactPhotoRepository.Get(contactId, Session);
            return photoContent?.Image;
        }
    }
}
