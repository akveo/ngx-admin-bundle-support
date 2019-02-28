/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.DataAccess.EFCore;
using Common.Entities;
using IoT.Entities;
using IoT.Entities.System;
using IoT.Services.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IoT.DataAccess.EFCore
{
    public class ContactRepository : BaseRepository<Contact, IoTDataContext>, IContactRepository
    {
        public ContactRepository(IoTDataContext context) : base(context)
        {
        }

        public override async Task<bool> Exists(Contact obj, ContextSession session)
        {
            var context = GetContext(session);
            return await context.Contacts.Where(x => x.Id == obj.Id).AsNoTracking().CountAsync() > 0;
        }

        public override async Task<Contact> Get(int id, ContextSession session)
        {
            var context = GetContext(session);
            return await context.Contacts.Where(obj => obj.Id == id).AsNoTracking().FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Contact>> GetList(ContactFilter filter, ContextSession session)
        {
            var context = GetContext(session);
            var query = context.Contacts.AsQueryable();

            if (filter?.SearchText != null)
            {
                query = query.Where(x => x.FirstName.StartsWith(filter.SearchText) || x.LastName.StartsWith(filter.SearchText));
            }

            return await query
                .AsNoTracking()
                .OrderBy(x => x.FirstName)
                .Skip(filter.PageSize * (filter.PageNumber - 1))
                .Take(filter.PageSize)
                .ToArrayAsync();
        }
    }
}
